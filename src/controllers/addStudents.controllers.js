import { addStudents, fetchAllStudentsData, dummaddStudents, getEnrolledData, deletedStudents, searchStuident ,searchStuidentbybatchno} from "../services/addStudents.services.js";

const addStudentsData = async (req, res) => {
    try {
        const { name, course, date, email, cnic, batchNo, rollno } = req.body;
        const data = {
            name, course, date, email, cnic, batchNo, rollno
        }
        const saveaStudentsData = await addStudents(data)
        if (!saveaStudentsData) return res.status(400).json({ status: 400, message: "bad request" })
        return res.status(200).json({ status: 200, message: "success", saveaStudentsData })
    } catch (error) {
        return res.status(500).json({ message: "Failed to students data save in DB", errormessage: error.message })
    }
}

const dummyaddStudentsData = async (req, res) => {
    try {
        const saveaStudentsData = await dummaddStudents(req.body.data)
        return res.status(200).json({ status: 200, message: "success", saveaStudentsData })
    } catch (error) {
        return res.status(500).json({ message: "Failed to students data save in DB", errormessage: error.message })
    }
}


const getAllStudentsData = async (req, res) => {
    try {
        const response = await fetchAllStudentsData()
        if (!response || response.length === 0)
            return res.status(404).json({ status: 404, message: 'No data found', success: false });
        return res.status(200).json({ message: "success", studentsData: response })
    } catch (error) {
        return res.status(500).json({ message: "To Failed Fecth Data From Database", errormessage: error.message })
    }
}

const getallcoursesenrolledstudents = async (req, res) => {
    try {
        const course = req.query.course
        const response = await getEnrolledData(course)
        if (!response || response.length === 0) return res.status(404).json({ status: 404, message: "data not found" })
        return res.status(200).json({ status: 200, message: "success", data: response })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "internal error", errormessage: error.message })
    }
}

const DeleteGeneratedStudent = async (req, res) => {
    try {
        const studentId = req.params.id
        const reponse = await deletedStudents(studentId)
        if (!reponse) return res.status(404).json({ status: 404, message: "data not found" })
        return res.status(200).json({ status: 200, message: "success" })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "internal server error", errormessage: error.message })
    }
}
const searchStudentRoll = async (req, res) => {
    const rollNumber = req.query.rollNumber || '';

    if (!rollNumber) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request",
            errorMessage: "Roll number is required."
        });
    }

    try {
        const response = await searchStuident(rollNumber);
        res.json(response);
    } catch (error) {
        console.error("Error searching for student:", error);
        if (error.response && error.response.status) {
            return res.status(error.response.status).json({
                status: error.response.status,
                message: error.response.statusText,
                errorMessage: error.message
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Server Error",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
};
const searchStudentBatchNo = async (req, res) => {
    const batchNo = req.query.batchNo || '';
    

    if (!batchNo) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request",
            errorMessage: "Roll number is required."
        });
    }

    try {
        const response = await searchStuidentbybatchno(batchNo);
        res.json(response);
    } catch (error) {
        console.error("Error searching for student:", error);
        if (error.response && error.response.status) {
            return res.status(error.response.status).json({
                status: error.response.status,
                message: error.response.statusText,
                errorMessage: error.message
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Server Error",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
};



export {
    addStudentsData,
    getAllStudentsData,
    dummyaddStudentsData,
    getallcoursesenrolledstudents,
    DeleteGeneratedStudent,
    searchStudentRoll,
    searchStudentBatchNo
}