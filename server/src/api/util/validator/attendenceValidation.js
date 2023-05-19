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


module.exports.modifyAttendenceValidation = [
    body("aid").custom(v=> {
        if(v){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true
    }),
    body("userId").notEmpty().custom(v=> {
        if(v){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true
    }).withMessage("Invalid"),
    body("status").custom(v=> {
        if(!Array.isArray(v)){
            return false
        }
        return true
    }).customSanitizer(val=> {
        for(let i = 0; i < val.length; i++){
            if(!val[i]){
                val.splice(i,1)
            }
        }
        return val
    }),

    // body("checkInTime").custom().withMessage("required"),
    body("modifiedCheckOutTime").custom((v, {req})=> {
        if(new Date(v).getTime() > new Date(req.body.modifiedCheckOutTime).getTime()){
            return true
        }
        return true
    }).withMessage("invalid date time")
]