const { validationResult } = require("express-validator");
const Attendence = require("../models/attendenceModel");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");

const User = require('../models/userModel')


module.exports.createAttendence = async (req, res) => {
  try {
    const checkInTime = new Date(req.body.checkInTime);
    // const timeZone = req.body.tz;
    const status = req.body.status;
    const startDay = new Date(new Date(checkInTime).setHours(0, 0, 0, 0)).toISOString();
    const endDay = new Date(new Date(checkInTime).setHours(23, 59, 59, 59)).toISOString();
    
    console.log(req.body);
    console.log(startDay, endDay);


    const isUserAlreadyPunchedIn = await Attendence.findOne({
      userId: req.user._id,
      checkInTime: { $gte: new Date(startDay), $lte: new Date(endDay) },

    }).lean();
    console.log(isUserAlreadyPunchedIn);

    if (isUserAlreadyPunchedIn) return res.status(400).json({ "message": "User already punched in" });
    let args = {};
    for (let arg in req.body){
      if(arg === "userId"){
        args['userId'] = req.body["userId"]; 
      }
      if(arg === "checkInTime"){
        args['checkInTime'] = req.body["checkInTime"]; 

      }
      if(arg === "status"){
        args['status'] = req.body["status"]; 

      }
      if(arg === "checkOutTime"){
        args['checkOutTime'] = req.body["checkOutTime"]; 
        args['isModified'] = true;
      }
      

    }
    const userAttendence = await new Attendence({
      userId: req.user._id,
      status: status,
      checkInTime: checkInTime,
      createdBy: req.user._id,
    }).save()

    return res.status(201).json({ "message": "Punch In Successfully", info: userAttendence })

  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}

module.exports.getAttendences = async (req, res) => {
  try {
    const errors = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(errors)) return res.status(400).json(errors)
    const body = req.body;
    console.log("Attendance body", body);
    const limit = req.body.limit ? parseInt(req.query.limit) : 10;
    const arg = {}

    let todaysDate = new Date();

    arg['usersId'] = body['userId'] || req.user._id;
    arg['monthDateYear'] = body["monthDateYear"] ? new Date(body['monthDateYear']) : todaysDate;



    let dates = []
    let month = arg['monthDateYear'].getMonth() + 1
    let year = arg['monthDateYear'].getFullYear()
    let days = arg['monthDateYear'].getDate()
    const firstDate = new Date(`${month}/01/${year}`).setHours(0, 0, 0, 0);
    // let lastDay = new Date(arg['monthDateYear'].getFullYear(), todaysDate.getMonth() + 1, 0).setHours(23, 59, 59, 999);
    let lastDay = new Date(arg['monthDateYear'].setHours(23,59,59,999));

    // console.log("first date", new Date(firstDate));
    // console.log("last date", new Date(lastDay));
    

    const allAttendence = await Attendence.find({
      userId: arg.usersId,
      checkInTime: {
        $gte: new Date(firstDate).toISOString(),
        $lte: new Date(lastDay).toISOString()
      }
    }).select("-createdAt -updatedAt -createdBy -updatedBy -__v").lean()

    let totalMinutes = 0;
    let totalWorkingHour = 0;
    // console.log("all", allAttendence);
    allAttendence.forEach(item => {
      if(item?.checkInTime  && item?.checkOutTime){

        const checkInTime = item?.modifiedCheckInTime? new Date(item.modifiedCheckInTime): new Date(item.checkInTime);
        const checkOutTime = item?.modifiedCheckOutTime? new Date(item.modifiedCheckOutTime) : new Date(item.checkOutTime);
        const timeDiffInMiliSeconds = checkOutTime.getTime() - checkInTime.getTime();
        const timeDiffMinutes = Math.floor(timeDiffInMiliSeconds / (1000 * 60));
        totalMinutes += parseFloat(timeDiffMinutes);
      }
    });
    // console.log(totalHours);
    totalWorkingHour = totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}:${totalMinutes % 60}` : "0"

    const userName = await User.findOne({ _id: arg.usersId }).select("firstName").lean()

    for (let i = 1; i <= days; i++) {
      let name = `${month}/${i}/${year}`;
      dates.push(name)
    }

    let dateObj = {}
    for (let d of dates) {
      dateObj[d] = {}
    }

    for (let att of allAttendence) {
      let dateStringToLocale = att.checkInTime.toLocaleDateString().split(" ")[0];

      if (dateStringToLocale in dateObj) {
        dateObj[dateStringToLocale] = { ...att, }
      }
    }

    let arr = [];
    for (let d in dateObj) {
      arr.push({ key: d, ...dateObj[d], name: userName?.firstName, userId: userName?._id })
    }

    return res.status(200).json({ "attendenceList": arr , "totalHours": totalWorkingHour})

  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ "message": "Something went wrong" });
  }
}

module.exports.updateAttendece = async (req, res) => {
  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
    const attendeceId = req.body.aId;
    const userId = req.body.userId;
    const data = {
      ...req.body.updateData,
    }
    

    const attendence = await Attendence.findOne({ _id: attendeceId, userId: userId }).lean();
    if (!attendence) return res.status(404).json({ "message": "Not found" });
    if( attendence.userId.toString() === req.user._id || req.user.role.alias === "Admin" ) {
      // console.log(attendence);
      const updatedDoc = await Attendence.findOneAndUpdate({
        _id: attendeceId, userId: userId
      }, {
        $set: {
          ...data,
          updatedBy: req.user._id,
          isModified: true,
        }
      }, { new: true })
        .select({ userId: 1, status: 1, checkInTime: 1, checkOutTime: 1 }).lean()
  
      return res.status(200).json({ "message": "Updated successfully", data: updatedDoc })
      
    } 

    return res.status(403).json({"message": "You can not authorize to modify others user attendence"})
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ "message": "Something went wrong" });


  }
}

module.exports.getTodayAttendence = async (req, res) => {
  try {
    // const errors = validationMessages(validationResult(req).mapped());
    // if(isErrorFounds(errors)) return res.status(400).json(errors)
    // const body = req.body;
    const checkInTime = new Date(req.body.checkInTime);
    // req.body.checkInTime;
    console.log("query", checkInTime.toLocaleString());

    const startDay = new Date(new Date(checkInTime).setHours(0, 0, 0, 0)).toISOString();
    const endDay = new Date(new Date(checkInTime).setHours(23, 59, 59, 59)).toISOString();

    const isPunchedIn = await Attendence.findOne({
      userId: req.user._id,
      $or: [{checkInTime: {
        $gte: new Date(startDay).toISOString(),
        $lte: new Date(endDay).toISOString()
      }}, {modifiedCheckInTime: {$gte: new Date(startDay).toISOString(),
        $lte: new Date(endDay).toISOString()}}]
     
    }).select("-createdAt -updatedAt -createdBy -updatedBy -__v")

    console.log("is punched in ", isPunchedIn);
    return res.status(200).json({ "punched": isPunchedIn ? isPunchedIn : "" })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}


module.exports.getAllUserAttendenceSheet = async (req, res) => {
  try{
    let firstDate = ""
    let lastDate = ""
    let range = []
    const searchingDate = req.body.searchingDate
    console.log(searchingDate);
    if (searchingDate === '') {
      const todayYear = new Date().getFullYear()
      const todayMonth = new Date().getMonth() + 1
      const todayDate = new Date().getDate() 
      firstDate = `${todayYear}-${todayMonth}-01`
      lastDate = `${todayYear}-${todayMonth}-${todayDate + 1}`
      range = [1, todayDate + 1]
    } else {
      const month = new Date(searchingDate).getMonth() + 1
      const year = new Date(searchingDate).getFullYear()
      const daysInMonth = new Date(year, month, 0).getDate()
      firstDate = `${year}-${month}-01`
      lastDate = `${year}-${month}-${daysInMonth + 1}`
      range = [1, daysInMonth + 1]
  
    }
  // console.log(firstDate,lastDate);
    const result = await Attendence.aggregate([
      {
        $match: {
          checkInTime: {
            $gte: new Date(firstDate),
            $lte: new Date(lastDate)
          },
        }
      },     
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },  
      {
        $group: {
          _id: {
            userId: "$userId",
            day: { $dayOfMonth: "$checkInTime" },
            aID:"$status",
            checkIn:"$checkInTime",
            modifiedCheckIn:"$modifiedCheckInTime"
          },
          count: { $sum: 1 },
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          attendance: {
            $push: {
              day: "$_id.day",
              present: {
                $cond: [{ $gte: ["$count", 1] }, true, false]
              },
              aId:"$_id.aID",
              checkIn:"$_id.checkIn",
              modifiedCheckIn:{ $ifNull: [ "$_id.modifiedCheckIn", "Unspecified" ] }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id:0,
          user: '$user.firstName',
          attendance: {
            $map: {
              input: { $range: range },
              as: "day",
              in: {
                day: "$$day",
                present: {
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.present", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    false
                  ]
                },
                aId:{
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.aId", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    []
                  ]
                },
                checkIn:{
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.checkIn", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    ''
                  ]
                },
                modifiedCheckIn:{
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.modifiedCheckIn", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    ''
                  ]
                }
              }
            }
          }
        }
      }
    ])
  
    return res.status(200).send(result)
  }catch(e){
    return res.status(500).json({message:"Something Went Wrong"})
  }
  
}


module.exports.todaysPunchInUsers = async (req, res)=> {

  try{
    const startDay = new Date().setHours(0, 0, 0, 0);
    const endDay = new Date().setHours(23, 59, 59, 59);
    console.log(startDay, endDay);
    const attendance = await Attendence.aggregate([
      {$match: {
        "checkInTime": {$gte: new Date(startDay), $lte: new Date(endDay)}
      }},
      // {$lookup: {
      //   from: "users",
      //   localField: "userId",
      //   foreignField: "_id",
      //   as: "userInfo"
      // }},
      // {$unwind: "$userInfo"},
      // {
      //   $addFields: {
      //     isPunchedToday: {
      //       $cond: [{$}]
      //     }
      //   }

      // },
      // {$project: {
        
      //   userId: 1,
      //   checkInTime: 1,
      //   checkOutTime: 1,
      //   status: 1,
        
      // }}

      
    ])

    let obj = {}
    for(let att of attendance){
      obj[att.userId] = {...att}
    }
    console.log(obj);
    return res.status(200).json({"data": obj})

  }catch(err){

    console.log(err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}


module.exports.modifiedORCreateAttendence = async (req, res) => {
  try{
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
    const data = req.body;
    console.log("data", data);
    console.log(req.user._id.toString() === data.userId.toString());
    if(req.user.role.alias === "Admin" || req.user._id.toString() === data.userId.toString())
    {
      if(!data.aId){
        let truncateData = {}
        truncateData.userId = data.userId;
        truncateData.isModified = true;
        truncateData.status = data.status;
        // truncateData.modifiedCheckInTime = new Date(data.modifiedCheckInTime) || "";
        // truncateData.modifiedCheckOutTime = new Date(data.modifiedCheckOutTime) || "";
  
        for(d in data){
          if(d === "checkInTime" && !data["checkInTime"]){
            truncateData["checkInTime"] = new Date(data["modifiedCheckInTime"])
          }
          if(d === "checkOutTime" && !data["checkOutTime"] && data.modifiedCheckOutTime){
            truncateData["checkOutTime"] = new Date(data["modifiedCheckOutTime"])
          }
        }

        const stratOftheDay = new Date(new Date(truncateData.checkInTime).setHours(0,0,0,0));
        const endOftheDay = new Date(new Date(truncateData.checkInTime).setHours(23,59,59,999))
        
        
        console.log("start ", stratOftheDay);
        console.log("end ", endOftheDay);
        
        console.log("truncate",truncateData);
        // return
        const isAttendenceAvailbe = await Attendence.findOne({
          userId: truncateData.userId, 
          checkInTime:{$gte: stratOftheDay}, checkOutTime: {$lte: endOftheDay}
        
        }).lean();
        console.log("avilabe attendence", isAttendenceAvailbe);
        if(isAttendenceAvailbe) return res.status(400).json({'message': "Attendece available already"});
        const newAttendece = await new Attendence({...truncateData}).save(); 
        return res.status(200).json({"message": "Succesfull", data: newAttendece})
      }else{

        console.log("else",data);
        if(!data.checkOutTime) data.checkOutTime = data.modifiedCheckOutTime;


        const att = await Attendence.findOne({_id: data.aId}).lean();
        const updatedAttendence = await Attendence.findOneAndUpdate({_id: data?.aId}, {$set: {...data, isModified: true}}, {new: true}).lean();
        return res.status(200).json({"message": "Successfull", data: updatedAttendence})
  
      }

    }
    return res.status(403).json({"message": 'Permission denied'})


  }catch(err){
    console.log(err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}




/*************************** helper function *****************/
const totalHour = (sDate, eDate) => {
  const diffInMilliseconds = Math.abs(eDate - sDate);
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  // console.log(diffInHours);
  return diffInHours.toFixed(2)
}
