import mongoose from "mongoose";
import AdminPassword from "./adminpassword.model.js";
// import Certificatie from "./certificate.module.js";
import CoursesModel from "./courses.model.js";
import StudentsModel from "./students.model.js";
import certificateModule from "./certificate.module.js"

let db = {}

db.mongoose = mongoose;
// db.certificate = certificateModel
db.certificate = certificateModule;
db.adminpassword = AdminPassword;
db.courses = CoursesModel
db.students = StudentsModel

export default db



