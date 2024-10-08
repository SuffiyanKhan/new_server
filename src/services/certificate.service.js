import app from '../../index.js';
import pLimit from 'p-limit';
import puppeteer from "puppeteer";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import db from '../modules/index.js'
import { serverConfig } from '../configs/server.config.js';


const { certificate: Certificate, students: Students } = db


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempDir = path.join(__dirname, 'temp/certificates');




cloudinary.config({
    cloud_name: serverConfig.cloudinaryName,
    api_key: serverConfig.clodinaryApiKey,
    api_secret: serverConfig.cloudinaryApiSectret
});

const getAllDataAccordingToCondition = async (batchNo, course) => {
    try {
        const students = await Students.find({ batchNo: batchNo, course: course, courseIsComplete: false }).exec();
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error.message;
    }
}
const fetchNewAndUpdateCertificatesBaseOnRollNo = async (rollnos) => {
    try {
        const certificates = await Students.find({ rollno: { $in: rollnos }}).exec();
        return certificates
    } catch (error) {
        console.error(error.message)
        throw error
    }
}


const cleanupTempFolder = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) {
            console.error('Error reading temp directory:', err);
            return;
        }
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }

        console.log('Temporary folder cleaned up.');
    });
};


async function generateCertificates(dataArray) {
    console.log(dataArray)
    const totalDataLength = dataArray.length;

    const limit = pLimit(10);
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        protocolTimeout: 240000,
        headless: true,
        defaultViewport: null
    });
    let savedCertificatesCount = 0;
    const results = [];
    async function processCertificate(data) {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(300000);

        try {
            await page.goto('about:blank', { waitUntil: 'networkidle2' });

            const qrCodeUrl = await generateQRCode(data);

            const certificateHtml = await generateCertificateHtml(data, qrCodeUrl);

            await page.setContent(certificateHtml, { waitUntil: 'domcontentloaded' });
            const pdfBuffer = await page.pdf({ format: 'A4' });

            const fileName = `${uuidv4()}.pdf`;
            const filePath = path.join(tempDir, fileName);

            await savePdfToFile(pdfBuffer, filePath);
            const uploadResult = await uploadPdfToCloudinary(filePath)
            results.push({ data, cloudinaryUrl: uploadResult });
            fs.unlinkSync(filePath);
            savedCertificatesCount++;
        } catch (error) {
            throw error
        } finally {
            await page.close();
        }
    }
    const tasks = dataArray.map(data => limit(() => processCertificate(data)));
    await Promise.all(tasks);
    await browser.close();
    return results;
}




async function generateCertificateHtml(data, qrCodeUrl) {
    return new Promise((resolve, reject) => {
        const student_Data = {
            name: data.name,
            course: data.course,
            batchNo: data.batchNo,
            rollno: data.rollno
        }

        app.render('certificate', { ...student_Data, qrCodeUrl }, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

async function generateQRCode(data) {
    const url = `${encodeURIComponent(data.name)} Verified by Saylani It Mass Training which enrolled in ${encodeURIComponent(data.course)} course from ${encodeURIComponent(data.date)}`;
    return QRCode.toDataURL(url);
}

async function savePdfToFile(pdfBuffer, filePath) {

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, pdfBuffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
}
const uploadPdfToCloudinary = async (filePath) => {
    try {

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            upload_preset: 'my_preset'
        });
        return result.secure_url;
    } catch (error) {
        throw error;
    }
};

async function saveCertificateToDB(data, certificateUrl) {
    try {
        const certificates = new Certificate({
            name: data.name,
            course: data.course,
            date: data.date,
            certificateUrl: certificateUrl,
            email: data.email,
            cnic: data.cnic,
            batchNo: data.batchNo,
            rollno: data.rollno
        });
        await certificates.save();
        await Students.updateOne(
            { email: data.email },
            { courseIsComplete: true }
        )
        return certificates
    } catch (error) {
        throw error;
    }
}

const getAllCertificatesData = async () => {
    try {
        const response = await Certificate.find({}).exec();
        return response
    } catch (error) {
        throw error
    }
}


const deleteCertificate = async (id) => {
    try {
        const response = await Certificate.deleteOne({ _id: id })
        return response
    } catch (error) {
        throw error
    }
}


const getAllCertifiedStudents = async (rollno) => {
    try {
        const response = await Certificate.find({ rollno: rollno }).exec();
        return response
    } catch (error) {
        throw error
    }
}

// const studentDetails = (name, course, date) => {
//     try {
//         res.render('student-details', { name, course, date });
//     } catch (error) {
//         throw error
//     }
// }

// async function generateQRCode(data) {
//     const baseUrl = 'http://localhost:3000/student-details'; // Replace with your actual domain
//     const url = `${baseUrl}?name=${encodeURIComponent(data.name)}&course=${encodeURIComponent(data.course)}&date=${encodeURIComponent(data.date)}`;
//     await studentDetails(data.name, data.course, data.date)
//     return QRCode.toDataURL(url);
// }


const studentDetails = (name, course, date) => {
    return new Promise((resolve, reject) => {
        try {
            app.render('student-details', { name, course, date }, (err, html) => {
                if (err) {
                    reject(err); // If an error occurs, reject the promise
                } else {
                    resolve(html); // If successful, resolve with the rendered HTML
                }
            });
        } catch (error) {
            reject(error); // Catch any other errors and reject the promise
        }
    });
};
// app.get('/student-details', (req, res) => {
//     const { name, course, date } = req.query;
//     if (!name || !course || !date) {
//         return res.status(400).send('Missing required query parameters');
//     }
//     res.render('student-details', { name, course, date });
// });

export {
    generateCertificates,
    getAllDataAccordingToCondition,
    getAllCertificatesData,
    cleanupTempFolder,
    deleteCertificate,
    fetchNewAndUpdateCertificatesBaseOnRollNo,
    getAllCertifiedStudents,
    studentDetails,
    saveCertificateToDB
}