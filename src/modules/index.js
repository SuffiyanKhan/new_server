import mongoose from "mongoose";
// import AdminPassword from "./adminpassword.model.js";
// import Certificatie from "./certificate.module.js";
import CoursesModel from "./courses.model.js";
// import StudentsModel from "./students.model.js";
import certificateModule from "./certificate.module.js"
import adminModule from "./adminpassword.model.js"
import studentModule from "./students.model.js";


let db = {}

db.mongoose = mongoose;
// db.certificate = certificateModel
db.certificate = certificateModule;
db.adminpassword = adminModule;

db.courses = CoursesModel
db.students = studentModule

export default db



