// import mongoose from "mongoose";

// const { Schema } = mongoose

// const AdminPasswordSchema = new Schema({
//     password: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     otp: {
//         type: Number,
//     },
//     isActive: {
//         type: Boolean,
//         default: false
//     }
// }, { timestamps: true })

// const AdminPassword = mongoose.model('AdminPassword', AdminPasswordSchema)
// export default AdminPassword



import mongoose, { mongo } from "mongoose";


const {Schema}=mongoose


const adminShcema=Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: false
    }
})

const adminModule = mongoose.model("AdminPassword",adminShcema)


export default adminModule