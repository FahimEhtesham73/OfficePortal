const {check, body} = require("express-validator")

module.exports.createAttendence = [
    body("checkInTime").custom(v=> {
        try{

        }catch(err){
            return false
        }
    })
]