const { query } = require("express")
const {check, body} = require("express-validator")
const mongoose = require('mongoose')
// firstName, lastName, email, password, designation, role, department,empId,joiningDate
module.exports.createEmployeeValidation = [
    body("firstName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("lastName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("email").notEmpty().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").notEmpty().isString().isLength({min: 5}).withMessage("Invalid Password"),
    body("designation").notEmpty().isMongoId().withMessage("Invalid designation"),
    body("role").notEmpty().isMongoId().withMessage("Invalid Role"),
    body("department").notEmpty().isMongoId().withMessage("Invalid department"),
    body("empId").notEmpty().isString().isLength({min:5}).withMessage("Invalid department"),
    body("joiningDate").notEmpty().withMessage("Date cannot be empty")
]

module.exports.searchEmployeeValidation = [
    body('empName').isString().withMessage("Invalid user Name"),
    body("userId").isString().withMessage("Invalid Employee Id"),
    // .custom(v=> {
    //     if(v){
    //         return mongoose.isObjectIdOrHexString(v)
    //     }
    //     return true;
    // }),
    body("deptId").custom(v=> {
        if(v){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true;
    })
    
]

module.exports.signinDataValidation = [
    body("email").notEmpty().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").notEmpty().isString().isLength({min: 5}).withMessage("Invalid Password")
]

module.exports.updateSingleUserValidation = [
    body("email").custom((v)=>{
        if(v){
            let pattern = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
            return pattern.test(v);
        }
        return true;
    }),
    check("id").isMongoId().withMessage("Invalid id")
]

module.exports.resetPasswordValidation = body('userId').isMongoId()

module.exports.changePasswordValidation = [
    body("userId").isMongoId(),
    // body("currentPassword").notEmpty().isString(),
    body("newPassword").notEmpty().isString().isLength({min: 8}).withMessage("Password should be 8 characters")
]