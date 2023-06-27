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

// _id: '6494071ed97efce47d57cf0a',
// userId: '642d4a3d362e3543b1bddc93',
// leaveType: 'Sick',
// startDate: '2023-06-22T18:00:00.000Z',
// endDate: '2023-06-22T18:00:00.000Z',
// totalDay: 0.5,
// leaveReason: 'shorir betha barse'
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