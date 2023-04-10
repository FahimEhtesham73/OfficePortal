const {check, body} = require("express-validator")

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

module.exports.signinDataValidation = [
    body("email").notEmpty().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").notEmpty().isString().isLength({min: 5}).withMessage("Invalid Password")

]