const {check, body, query} = require("express-validator")
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Holiday = require("../../models/holidaySchema")

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

    body("totalDay").notEmpty().custom(async(v, {req})=> {
        let totalHolidays = await Holiday.find().lean();
        let customize = totalHolidays.map((v)=> new Date(v.date).toISOString().split("T")[0])
        let totalHolidayInRange = totalHolidaysCustomize(req.body.startDate, req.body.endDate, customize);
        let total = daysCount(new Date(req.body.startDate), new Date(req.body.endDate)) - totalHolidayInRange;
        return parseInt(total) === parseInt(v);
    }).customSanitizer(v=> Number(v)),
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

const totalHolidaysCustomize = (startDate, endDate, customHolidays = []) => {
    if (new Date(startDate) < new Date(endDate)) {
      endDate = new Date(endDate).setHours(23, 59, 59, 999);
      startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      let count = 0;
      while (startDate <= endDate) {
        const dayOfWeek = startDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 represents Sunday, 6 represents Saturday
          count++;
        } else if (customHolidays.includes(startDate.toISOString().split('T')[0])) {
          count++;
        }
  
        startDate.setDate(startDate.getDate() + 1);
      }
  
      return count;
    } else {
      return 0;
    }
  };

  const daysCount = (date_1, date_2) => {
    if (date_1 && date_2) {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
  
    } else {
        return 0
    }
  }