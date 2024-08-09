import { cleanupTempFolder, deleteCertificate, fetchNewAndUpdateCertificatesBaseOnRollNo, generateCertificates, getAllCertificatesData, getAllCertifiedStudents, getAllDataAccordingToCondition, saveCertificateToDB } from '../services/certificate.service.js';

// const certificategenerate = async (req, res) => {
//     try {
//         const { batchno, course, rollno } = req.body
//         const responses = await fetchNewAndUpdateCertificatesBaseOnRollNo(batchno, course, rollno)
//         if (!response || response.length === 0) {
//             return res.status(404).json({ status: 404, message: "No data found for the given criteria" });
//         }
//         const response = await getAllDataAccordingToCondition(batchno, course);
//         if (!response || response.length === 0) return res.status(404).json({ status: 404, message: "data not found", success: false })
//         const pdfFileNames = await generateCertificates(response);
//         await cleanupTempFolder()
//         if (!pdfFileNames) {
//             return res.status(400).send({ status: 400, message: "Bad Request" });
//         }
//         if (pdfFileNames.length > 0) {
//             await cleanupTempFolder()
//             return res.status(200).send({ message: "Task is in progress. Certificates are being generated." });
//         } else {
//             await cleanupTempFolder()
//             return res.status(200).send({ message: "Task is complete. Certificates generated successfully."});
//         }
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
//         } else if (error.name === 'MongoError') {
//             return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
//         } else {
//             return res.status(500).json({ status: 500, message: "Internal Server Error", errorMessage: error.message });
//         }    }
// }


const certificategenerate = async (req, res) => {
    try {
        const { batchno, course, rollno } = req.body;

        const response = await fetchNewAndUpdateCertificatesBaseOnRollNo(rollno);
        if (!response || response.length === 0) {
            return res.status(404).json({ status: 404, message: "No data found for the given criteria" });
        }

        return res.status(200).send({ message: "Task is complete. Certificates generated successfully.", data: response });
        // if (rollno) {
        // } else if (batchno && course) {
        //     const response = await getAllDataAccordingToCondition(batchno, course);
        //     console.log(response)
        //     if (!response || response.length === 0) {
        //         return res.status(404).json({ status: 404, message: "No data found for the given criteria" });
        //     }

        //     const pdfFileNames = await generateCertificates(response);
        //     await cleanupTempFolder();

        //     if (!pdfFileNames) {
        //         return res.status(400).send({ status: 400, message: "Bad Request" });
        //     }

        //     if (pdfFileNames.length > 0) {
        //         return res.status(200).send({ message: "Task is in progress. Certificates are being generated." });
        //     } else {
        //         return res.status(200).send({ message: "Task is complete. Certificates generated successfully." });
        //     }
        // } else {
        //     return res.status(400).json({ status: 400, message: "Incomplete or invalid parameters provided" });
        // }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
        } else {
            return res.status(500).json({ status: 501, message: "Internal Server Error", errorMessage: error.message });
        }
    }
};



// const generatedCertificateBaseOnRollNo = async (req, res) => {
//     try {
//         const { batchno, course, rollno } = req.body
//         const response = await fetchNewAndUpdateCertificatesBaseOnRollNo(batchno, course, rollno)
//         if (!response || response.length === 0) {
//             return res.status(404).json({ status: 404, message: "No data found for the given criteria" });
//         }
//         const pdfFileNames = await generateCertificates(response);
//         await cleanupTempFolder()
//         if (!pdfFileNames) {
//             return res.status(400).send({ status: 400, message: "Bad Request" });
//         }
//         if (pdfFileNames.length > 0) {
//             await cleanupTempFolder()
//             return res.status(200).send({ message: "Task is in progress. Certificates are being generated." });
//         } else {
//             await cleanupTempFolder()
//             return res.status(200).send({ message: "Task is complete. Certificates generated successfully." });
//         }
//         // return res.status(200).json({ status: 200, message: "success", data: response })
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
//         } else if (error.name === 'MongoError') {
//             return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
//         } else {
//             return res.status(500).json({ status: 500, message: "Internal Server Error", errorMessage: error.message });
//         }
//     }
// }

const getAllcertificategenerate = async (req, res) => {
    try {
        const response = await getAllCertificatesData();
        console.log(response)
        if (!response) return res.status(400).json({ status: 400, message: "bad request" })
        return res.status(200).json({ status: 200, message: "success", data: response })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
        } else {
            return res.status(500).json({ status: 500, message: "Internal Server Error", errorMessage: error.message });
        }
    }
}

const DeleteGeneratedCertificates = async (req, res) => {
    try {
        const studentId = req.params.id
        const response = await deleteCertificate(studentId)
        if (!response) return res.status(404).json({ status: 404, message: "datq not found" })
        return res.status(200).json({ status: 200, message: "success" })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
        } else {
            return res.status(500).json({ status: 500, message: "Internal Server Error", errorMessage: error.message });
        }
    }
}

const getallstudentscertified = async (req, res) => {
    try {
        const { rollno } = req.body
        const response = await getAllCertifiedStudents(rollno)
        return res.status(200).json({ status: 200, message: "success", data: response })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "internal server error", errormessage: error.message })
    }
}


const generatecertificatestudents = async (req, res) => {
    try {
        const { data } = req.body;
        // console.log(data)
        const pdfFileNames = await generateCertificates(data);
        console.log(pdfFileNames)
        await cleanupTempFolder();
        if (!pdfFileNames) {
            return res.status(400).send({ status: 400, message: "Bad Request" });
        }

        return res.status(200).send({ message: "Certificates are generated.", data: pdfFileNames });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
        } else {
            return res.status(500).json({ status: 501, message: "Internal Server Error", errorMessage: error.message });
        }
    }
}


const saveToDataBase = async (req, res) => {
    const entries = req.body.data;
    try {
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ status: 400, message: "Invalid data format", errorMessage: "Expected 'data' to be an array" });
        }

        const savedCertificates = [];
        for (const entry of entries) {
            try {
                const { data, cloudinaryUrl } = entry;
                if (!data || !cloudinaryUrl) {
                    throw new Error("Missing data or cloudinaryUrl in entry");
                }
                const response = await saveCertificateToDB(data, cloudinaryUrl);
                savedCertificates.push(response);
            } catch (entryError) {
                console.error("Error saving certificate entry:", entryError);
                continue; 
            }
        }

        return res.status(200).send({ message: "Certificates saved to DB.", data: savedCertificates });
    } catch (error) {
        console.error("Error in saveToDataBase:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: "Validation Error", errorMessage: error.message });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ status: 500, message: "Database Error", errorMessage: error.message });
        } else {
            return res.status(500).json({ status: 500, message: "Internal Server Error", errorMessage: error.message });
        }
    }
};



export {
    certificategenerate,
    getAllcertificategenerate,
    DeleteGeneratedCertificates,
    // generatedCertificateBaseOnRollNo,
    getallstudentscertified,
    generatecertificatestudents,
    saveToDataBase
    // studentDetails

}