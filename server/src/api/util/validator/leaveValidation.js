const {check, body} = require("express-validator")
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

module.exports.getAllLeave = [
    body("leaveType").custom(v=> typeof v === "string"),
    body("limit").custom(v=> typeof v === 'number').customSanitizer(v=> Number(v)),
    body("skip").custom(v=> typeof v === 'number').customSanitizer(v=> Number(v)),
    body("startDate").custom(v=> isDateString(v)),
    body("endDate").custom(v=> isDateString(v)),

]

function isDateString(v){
    if (isNaN(v)) {
        return false;
    } else {
        return true;
    }
}