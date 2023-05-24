const { query } = require("express")
const { check, body } = require("express-validator")
const mongoose = require('mongoose')


var is_date = function (input) {
    if (Object.prototype.toString.call(input) === "[object String]") {
        if (isNaN(new Date(input).getTime())) {
            return false;
        } else {
            return true;
        }
    }
    return false;
};

const validateProjectSupervisors = (val) => {
    // Extract the projectSuperVisor field from the request body
    const projectSuperVisor = val

    // Check if the field is an array and not empty
    if (!Array.isArray(projectSuperVisor) || projectSuperVisor.length === 0) {
        throw new Error('projectSuperVisor field must be a non-empty array.')
        // res.status(400).json({ error: 'projectSuperVisor field must be a non-empty array.' });
    }

    // Check if all values in the array are valid ObjectIds
    const isValid = projectSuperVisor.every((supervisor) => mongoose.isObjectIdOrHexString(supervisor));

    if (!isValid) {
        throw new Error('projectSuperVisor field contains invalid ObjectIds.')
    }
    return true
};

module.exports.createProjectValidation = [
    body('projectName').isString().withMessage("Invalid Project Name"),
    body('projectOwner').isString().withMessage("Invalid Project Owner Name"),
    body('projectDescription').isString().withMessage("Invalid Project Description"),
    body('superVisorTime').isNumeric().withMessage("Invalid Time Format"),
    body('leadTime').isNumeric().withMessage("Invalid Time Format"),
    body('memberTime').isNumeric().withMessage("Invalid Time Format"),
    body("projectStartTime").custom((val) => {
        if (!is_date(val)) return false
        return true;
    }),
    body("projectEndTime").custom((val) => {
        if (!is_date(val)) return false
        return true;
    }),
    body("projectSuperVisor").custom((val) => {
        return validateProjectSupervisors(val)
        
    }),
    body("projectLead").custom((val) => {
        return validateProjectSupervisors(val)
    }),
    body("projectMembers").custom((val) => {
        return validateProjectSupervisors(val)
    })

]