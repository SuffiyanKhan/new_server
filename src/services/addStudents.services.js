
import db from '../modules/index.js'
import generateOtp from '../utils/randomString.util.js'
const { students: Students } = db

const addStudents = async (payload) => {
    try {
        const rollNumber = await generateOtp()
        const savedata = await Students({ ...payload, rollno: rollNumber })
        const saveStudentData = await savedata.save();
        return saveStudentData
    } catch (error) {
        throw error
    }
}

const dummaddStudents = async (payload) => {
    try {
        const payloadWithRollNumbers = payload.map(student => {
            return {
                ...student,
                rollno: generateOtp()
            };
        });

        const savedata = await Students.insertMany(payloadWithRollNumbers);
        return savedata;
    } catch (error) {
        throw error
    }
}

const fetchAllStudentsData = async () => {
    try {
        const response = await Students.find({}).exec();
        return response
    } catch (error) {
        throw error
    }
}

const getEnrolledData = async (course) => {
    try {
        const response = await Students.find({ course: course })
        return response
    } catch (error) {
        throw error
    }
}

const deletedStudents = async (id) => {
    try {
        const response = await Students.deleteOne({ _id: id })
        return response
    } catch (error) {
        throw error
    }
}

const searchStuident = async (rollNumber) => {
    try {
        const results = await Students.find({ rollno: rollNumber }).exec();
        return results
    } catch (error) {
        throw error
    }
}

// const searchStuidentbybatchno = async (batchNo) => {
//     try {
//         const response = await Students.find({ batchNo: batchNo });
//         console.log(response)
//         return response
//     } catch (error) {
//         throw error
//     }
// }

const searchStuidentbybatchno = async (batchNo) => {
    try {
        console.log(`Searching for batchNo: ${batchNo}`); // Debugging statement
        // const response = await Students.find({ batchNo: String(batchNo) });
        const response = await Students.find({ batchNo: String(batchNo)}).exec();
        return response;
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        throw error;
    }
}

export {
    addStudents,
    fetchAllStudentsData,
    dummaddStudents,
    getEnrolledData,
    deletedStudents,
    searchStuident,
    searchStuidentbybatchno
}