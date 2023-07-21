const {check, body} = require("express-validator")
const { default: mongoose } = require("mongoose")
const {isDateString} = require("../validator/commonValidation")
const { AttendeceTypes } = require("../commonValues")

module.exports.createAttendenceValidation = [
    body("checkInTime").custom(v=> {
        body("checkInTime").custom(v=> {
            return isDateString(v)
        })
        return true;
    }),
    body("status").custom(v=> {
        if(v.length > 0){
            return v.every(i=> AttendeceTypes.includes(i))
        }
    })
]


module.exports.updateAttendenceValidation = [
    body("aId").custom(v=> {
        if(v.length){
            return mongoose.isObjectIdOrHexString(v)
        }
        return true;
    }),
    body("userId").isMongoId().withMessage("Not valid"),
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

    body("checkInTime").custom(v=> {
        if(v.length > 0){
            return isDateString(v);
        }
        return true;
    }).withMessage("required"),
    body("modifiedCheckOutTime").custom((v, {req})=> {
        if(v &&  (new Date(v).getTime() < new Date(req.body.modifiedCheckOutTime).getTime())){
            // if(new Date(v).getTime() > new Date(req.body.modifiedCheckOutTime).getTime()){
            //     return true
            // }
            return false

        }
        return true
    }).withMessage("invalid date time")
]

module.exports.getTodaysAttendenceValidation = [
    body("checkInTime").custom(v=> {
        if(v.length > 0){
            return isDateString(v)
        }
        return true;
    })
]