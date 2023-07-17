const {check, body, query} = require("express-validator")
const mongoose = require("mongoose");
const User = require("../../models/userModel");


module.exports.createOrUpdateValidation = [
    body("userId").isMongoId().custom(async(v)=>{
        const user = await User.findOne({_id: v}).lean();
        if(!user) throw new Error("No user found")
        return true;
        
    } ),
    body("leaveCategory").custom(v=> {
        let list = ['sick', 'general'];
        return list.includes(v)
    }),
    body("leaveAmount").isNumeric().customSanitizer(v=> Number(v))
]


module.exports.updateLeveDetailsValidation = [
    body("_id").isMongoId(),
    body("userId").isMongoId(),
    body("leaveType").notEmpty().isString().custom((v)=> {
        let list = ['Sick', 'Casual', 'Special'];
        return list.includes(v)
    }),
    body("totalDay").custom(v=> v > 0),

    body("leaveReason").notEmpty().isString(),

]

module.exports.getAllLeaveValidation = [
    body("leaveType").custom(v=> typeof v === "string"),
    body("limit").custom(v=> isNaN(v)).customSanitizer(v=> Number(v)),
    body("skip").custom(v=> isNaN(v)).customSanitizer(v=> Number(v)),
    body("startDate").custom(v=> isDateString(v)),
    body("endDate").custom(v=> isDateString(v)),

]

module.exports.createLeaveValidation = [
    body("userId").isMongoId(),
    body("leaveType").custom(v=> typeof v === 'string'),
    body("startDate").notEmpty().custom(v=> isDateString(v)),
    body("endDate").notEmpty().custom(v=> isDateString(v) ),
    body("totalDay").notEmpty().custom(v=> typeof v === 'number').customSanitizer(v=> Number(v)),
    body("leaveReason").notEmpty().custom(v=> typeof v === 'string').customSanitizer(v=> v.trim()),

]

module.exports.leaveStatusChange = [
     body('leaveId').isMongoId(),
     body('approverId').isMongoId(),
     body('status').custom((v)=> {
        let list = ['Pending', 'Approved', 'Declined']
        return list.includes(v)
     }),

]

module.exports.getLeaveStatusValidation = [

    query("userId").isMongoId(),
    query("pageNumber").isNumeric(),
    query("pageSize").isNumeric(),

]
module.exports.leaveSummeryAPIValidation = [

    body("userId").isMongoId(),
    body("year").isNumeric(),

]
module.exports.leavesStatusChangeAPIValidation = [
   
    body("leaveId").isMongoId(),
    body("approverId").custom(v=> {
        if(v){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true
    }),
    body("status").custom(v=> {
        let list = ['Pending', 'Approved', 'Declined']
        return list.includes(v)
    }),
]

function isDateString(value){
    switch (typeof value) {
        case 'number':
            return true;
        case 'string':
            return !isNaN(Date.parse(value));
        case 'object':
            if (value instanceof Date) {
                return !isNaN(value.getTime());
            }
        default:
            return false;
    }
}