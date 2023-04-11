const {check, body} = require("express-validator")

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