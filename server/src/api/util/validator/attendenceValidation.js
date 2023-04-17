const {check, body} = require("express-validator")
const { default: mongoose } = require("mongoose")

module.exports.createAttendence = [
    body("checkInTime").custom(v=> {
        try{

        }catch(err){
            return false
        }
    })
]


module.exports.updateAttendenceValidation = [
    // body("aId").isMongoId().withMessage("Not valid"),
    // body("userId").isMongoId().withMessage("Not valid"),
    // body("updateDate").custom(v=> {
    //     if(v.checkOutTime && n){
            
    //     }
    // })
]

module.exports.getAttendenceValidation = [
    body("checkInTime").notEmpty().withMessage("Required").custom(v=> {
        return new Date(new Date(v).setHours(0,0,0,0)).getTime() <= new Date().getTime()
    }).withMessage("Invalid Date range"),
    body("monthDateYear").notEmpty().withMessage("Required").custom(v=> {
        return new Date(new Date(v).setHours(0,0,0,0)).getTime() <= new Date().getTime()  
    }).withMessage("Invalid Date range"),
    body("userId").custom(v=> {
        if(v){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true;
    })
]