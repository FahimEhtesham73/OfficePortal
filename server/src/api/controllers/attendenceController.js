const axios = require('axios');
const FormData = require('form-data');
const { validationResult } = require("express-validator");
const Attendence = require("../models/attendenceModel");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");

const User = require('../models/userModel');
const { isDateString } = require("../util/validator/commonValidation");
const Holiday = require("../models/holidaySchema");

module.exports.createAttendence = async (req, res) => {
  try {
    const errors = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(errors)) return res.status(400).json({ "message": errors })
    const checkInTime = new Date(req.body.checkInTime);
    // const timeZone = req.body.tz;
    const status = req.body.status;
    const startDay = new Date(new Date(checkInTime).setHours(0, 0, 0, 0)).toISOString();
    const endDay = new Date(new Date(checkInTime).setHours(23, 59, 59, 59)).toISOString();



    const isUserAlreadyPunchedIn = await Attendence.findOne({
      userId: req.user._id,
      checkInTime: { $gte: new Date(startDay), $lte: new Date(endDay) },

    }).lean();

    if (isUserAlreadyPunchedIn) return res.status(400).json({ "message": "User already punched in" });
    let args = {};
    for (let arg in req.body) {
      if (arg === "userId") {
        args['userId'] = req.body["userId"];
      }
      if (arg === "checkInTime") {
        args['checkInTime'] = req.body["checkInTime"];

      }
      if (arg === "status") {
        args['status'] = req.body["status"];

      }
      if (arg === "checkOutTime") {
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
    let lastDay = new Date(arg['monthDateYear'].setHours(23, 59, 59, 999));

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
      if (item?.checkInTime && item?.checkOutTime) {

        const checkInTime = item?.modifiedCheckInTime ? new Date(item.modifiedCheckInTime) : new Date(item.checkInTime);
        // console.log("Check in Time", checkInTime.getTime());

        const checkOutTime = item?.modifiedCheckOutTime ? new Date(item.modifiedCheckOutTime) : new Date(item.checkOutTime);

        // Define 8:30 AM for the same date as checkInTime
        const checkInDate = new Date(checkInTime);
        const referenceDate = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate(), 9,0); // 8:30 AM

        // Get the time to use for calculations (either 8:30 AM or the actual check-in time)
        const startTime = checkInTime.getTime() < referenceDate.getTime() ? referenceDate.getTime() : checkInTime.getTime();

        const timeDiffInMiliSeconds = checkOutTime.getTime() - startTime;
        const timeDiffMinutes = Math.floor(timeDiffInMiliSeconds / (1000 * 60));
        totalMinutes += parseFloat(timeDiffMinutes);
      }
    });
    // console.log(totalHours);
    totalWorkingHour = totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}.${totalMinutes % 60}` : "0"

    const userName = await User.findOne({ _id: arg.usersId }).select("firstName empId").lean()

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
      arr.push({ key: d, ...dateObj[d], name: userName?.firstName, userId: userName?._id, empCode: userName.empId })
    }

    const getHoliday = await Holiday.find({
      startDate: {
        $gte: firstDate
      },
      endDate: {
        $lte: getFirstAndLastDayOfMonthWithFullLastDay(firstDate).lastDay
      }
    })

    let holidaysList = []

    for (let item of getHoliday) {
      const h = getWorkingDaysArray(item.startDate, item.endDate)
      holidaysList.push(...h)
    }
    console.log(holidaysList);

    //finding missing checkin date

    const missingCheckInDate = findMissingCheckIn(arr);

    // console.log("missing check in date", arr, missingCheckInDate);


    //finding total working hour in this month
    const totalWorkingHoursInThisMonth = calculateWorkingHours(firstDate, [...holidaysList, ...missingCheckInDate])


    return res.status(200).json({ "attendenceList": arr, "totalHours": totalWorkingHour, "toatlWorkingHoursThisMonth": totalWorkingHoursInThisMonth, })

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
    if (attendence.userId.toString() === req.user._id || req.user.role.alias === "Admin") {
      // console.log(attendence);
      const updatedDoc = await Attendence.findOneAndUpdate({
        _id: attendeceId, userId: userId
      }, {
        $set: {
          ...data,
          updatedBy: req.user._id,
          // isModified: true,
        }
      }, { new: true })
        .select({ userId: 1, status: 1, checkInTime: 1, checkOutTime: 1 }).lean()

      return res.status(200).json({ "message": "Updated successfully", data: updatedDoc })

    }

    return res.status(403).json({ "message": "You can not authorize to modify others user attendence" })
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ "message": "Something went wrong" });


  }
}

module.exports.getTodayAttendence = async (req, res) => {
  try {
    const errors = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(errors)) return res.status(400).json(errors)
    // const body = req.body;
    const checkInTime = new Date(req.body.checkInTime);
    // req.body.checkInTime;
    console.log("query", checkInTime.toLocaleString());

    const startDay = new Date(new Date(checkInTime).setHours(0, 0, 0, 0)).toISOString();
    const endDay = new Date(new Date(checkInTime).setHours(23, 59, 59, 59)).toISOString();

    const isPunchedIn = await Attendence.findOne({
      userId: req.user._id,
      $or: [{
        checkInTime: {
          $gte: new Date(startDay).toISOString(),
          $lte: new Date(endDay).toISOString()
        }
      }, {
        modifiedCheckInTime: {
          $gte: new Date(startDay).toISOString(),
          $lte: new Date(endDay).toISOString()
        }
      }]

    }).select("-createdAt -updatedAt -createdBy -updatedBy -__v")

    console.log("is punched in ", isPunchedIn);
    return res.status(200).json({ "punched": isPunchedIn ? isPunchedIn : "" })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}


module.exports.getAllUserAttendenceSheet = async (req, res) => {
  try {
    const timeZone = "Asia/Dhaka"
    let firstDate = ""
    let lastDate = ""
    let range = []
    const searchingDate = req.body.searchingDate
    if (searchingDate === '') {
      const todayYear = new Date().getFullYear()
      const todayMonth = new Date().getMonth()
      const todayDate = new Date().getDate()

      const firstDateYear = new Date().setFullYear(todayYear)
      const firstDateMonth = new Date(firstDateYear).setMonth(todayMonth)
      const firstDateDate = new Date(firstDateMonth).setDate(1)
      const lastDateDate = new Date(firstDateMonth).setDate(todayDate)
      firstDate = new Date(firstDateDate).setHours(0, 0, 0, 0)
      lastDate = new Date(lastDateDate).setHours(23, 59, 59, 999)

      range = [1, todayDate + 1]

    } else {
      const month = new Date(searchingDate).getMonth() + 1
      const year = new Date(searchingDate).getFullYear()
      const daysInMonth = new Date(year, month, 0).getDate()
      firstDate = `${year}-${month}-01`
      lastDate = `${year}-${month}-${daysInMonth}`
      range = [1, daysInMonth + 1]
    }



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
            day: { $dayOfMonth: { date: "$checkInTime", timezone: timeZone } },
            aID: "$status",
            checkIn: "$checkInTime",
            modifiedCheckIn: "$modifiedCheckInTime"
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
              aId: "$_id.aID",
              checkIn: "$_id.checkIn",
              modifiedCheckIn: { $ifNull: ["$_id.modifiedCheckIn", "Unspecified"] }
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
          _id: 0,
          user: '$user.firstName',
          officeTimeSlot:'$user.officeTimeSlot',
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
                aId: {
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.aId", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    []
                  ]
                },
                checkIn: {
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.checkIn", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    ''
                  ]
                },
                modifiedCheckIn: {
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
  } catch (e) {
    return res.status(500).json({ message: "Something Went Wrong" })
  }

}

module.exports.getSingleUserAttendenceSheet = async (req, res) => {
  try {
    const timeZone = "Asia/Dhaka"
    let firstDate = ""
    let lastDate = ""
    let range = []
    const searchingDate = req.body.searchingDate
    const userId = req.body.userId

    if (searchingDate === '') {
      const todayYear = new Date().getFullYear()
      const todayMonth = new Date().getMonth()
      const todayDate = new Date().getDate()

      const firstDateYear = new Date().setFullYear(todayYear)
      const firstDateMonth = new Date(firstDateYear).setMonth(todayMonth)
      const firstDateDate = new Date(firstDateMonth).setDate(1)
      const lastDateDate = new Date(firstDateMonth).setDate(todayDate)
      firstDate = new Date(firstDateDate).setHours(0, 0, 0, 0)
      lastDate = new Date(lastDateDate).setHours(23, 59, 59, 999)

      range = [1, todayDate + 1]

    } else {
      const month = new Date(searchingDate).getMonth() + 1
      const year = new Date(searchingDate).getFullYear()
      const daysInMonth = new Date(year, month, 0).getDate()
      firstDate = `${year}-${month}-01`
      lastDate = `${year}-${month}-${daysInMonth}`
      range = [1, daysInMonth + 1]
    }

    // console.log(firstDate, lastDate);

    const result = await Attendence.aggregate([
      {
        $match: {
          checkInTime: {
            $gte: new Date(firstDate),
            $lte: new Date(lastDate)
          },
          userId: new mongoose.Types.ObjectId(userId)
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
            day: { $dayOfMonth: { date: "$checkInTime", timezone: timeZone } },
            aID: "$status",
            checkIn: "$checkInTime",
            modifiedCheckIn: "$modifiedCheckInTime"
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
              aId: "$_id.aID",
              checkIn: "$_id.checkIn",
              modifiedCheckIn: { $ifNull: ["$_id.modifiedCheckIn", "Unspecified"] }
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
          _id: 0,
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
                aId: {
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.aId", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    []
                  ]
                },
                checkIn: {
                  $cond: [
                    { $in: ["$$day", "$attendance.day"] },
                    { $arrayElemAt: ["$attendance.checkIn", { $indexOfArray: ["$attendance.day", "$$day"] }] },
                    ''
                  ]
                },
                modifiedCheckIn: {
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
  } catch (e) {
    return res.status(500).json({ message: "Something Went Wrong" })
  }

}


module.exports.todaysPunchInUsers = async (req, res) => {

  try {
    const startDay = new Date().setHours(0, 0, 0, 0);
    const endDay = new Date().setHours(23, 59, 59, 59);

    const attendance = await Attendence.aggregate([
      {
        $match: {
          "checkInTime": { $gte: new Date(startDay), $lte: new Date(endDay) }
        }
      },
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
    for (let att of attendance) {
      obj[att.userId] = { ...att }
    }
    return res.status(200).json({ "data": obj })

  } catch (err) {

    return res.status(500).json({ "message": "Something went wrong" });

  }
}


module.exports.modifiedORCreateAttendence = async (req, res) => {
  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
    const data = req.body;
    console.log(req.user._id.toString() === data.userId.toString());
    if (req.user.role.alias === "Admin" || req.user._id.toString() === data.userId.toString()) {
      if (!data.aId) {
        let truncateData = {}
        truncateData.userId = data.userId;
        truncateData.isModified = true;
        truncateData.status = data.status;
        // truncateData.modifiedCheckInTime = new Date(data.modifiedCheckInTime) || "";
        // truncateData.modifiedCheckOutTime = new Date(data.modifiedCheckOutTime) || "";

        for (d in data) {
          if (d === "checkInTime" && !data["checkInTime"]) {
            truncateData["checkInTime"] = new Date(data["modifiedCheckInTime"])
          }
          if (d === "checkOutTime" && !data["checkOutTime"] && data.modifiedCheckOutTime) {
            truncateData["checkOutTime"] = new Date(data["modifiedCheckOutTime"])
          }
        }

        const stratOftheDay = new Date(new Date(truncateData.checkInTime).setHours(0, 0, 0, 0));
        const endOftheDay = new Date(new Date(truncateData.checkInTime).setHours(23, 59, 59, 999))



        // return
        const isAttendenceAvailbe = await Attendence.findOne({
          userId: truncateData.userId,
          checkInTime: { $gte: stratOftheDay }, checkOutTime: { $lte: endOftheDay }

        }).lean();
        if (isAttendenceAvailbe) return res.status(400).json({ 'message': "Attendece available already" });
        const newAttendece = await new Attendence({ ...truncateData }).save();
        return res.status(200).json({ "message": "Succesfull", data: newAttendece })
      } else {

        if (!data.checkOutTime) data.checkOutTime = data.modifiedCheckOutTime;


        const att = await Attendence.findOne({ _id: data.aId }).lean();
        const updatedAttendence = await Attendence.findOneAndUpdate({ _id: data?.aId }, { $set: { ...data, isModified: true } }, { new: true }).lean();
        return res.status(200).json({ "message": "Successfull", data: updatedAttendence })

      }

    }
    return res.status(403).json({ "message": 'Permission denied' })


  } catch (err) {
    console.log(err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}

module.exports.updatedAttendenceDataFromMachine = async (req, res) => {
  try {
    const date = req.body.date;
    const employeeCode = req.body.employeeId;
    const userId = await User.findOne({ empId: employeeCode }).lean();
    if (!userId) return res.status(400).json({ "message": "User not found" });
    if (userId.empId !== employeeCode) return res.status(400).json({ "message": "Employee code missmatched" });
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(date);
    const allAttendence = await Attendence.find({
      userId: userId._id,
      checkInTime: { $gte: new Date(new Date(firstDay).setHours(0, 0, 0, 0)) },
      checkOutTime: { $lte: new Date(new Date(lastDay).setHours(23, 59, 59, 999)) }
    });
    const token = await fetchAuthenticationToken();
    const records = await fetchAttendanceRecords(token, employeeCode, date);
    if (!records[0].length) return res.status(400).json({ "message": "No records found" })

    async function updateAttendance(uId) {
      for (const updateEntry of records[0]) {
        const date = new Date(updateEntry.date);
        const userId = new mongoose.Types.ObjectId(uId); // Replace with the actual user ID

        // Find the corresponding entry in the Mongoose data
        const mongooseEntry = allAttendence.find(entry => {
          const entryDate = new Date(entry.checkInTime);

          return entryDate.getDate() === date.getDate() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear();
        });

        if (mongooseEntry) {
          // Update existing entry
          mongooseEntry.checkInTime = new Date(updateEntry.checkIn).toString();
          mongooseEntry.checkOutTime = new Date(updateEntry.checkOut).toString();

          // Assuming there are modified check-in and check-out times
          // mongooseEntry.modifiedCheckInTime = new Date(updateEntry.checkIn).toString();
          // mongooseEntry.modifiedCheckOutTime = new Date(updateEntry.checkOut).toString();

          // Save the changes
          await mongooseEntry.save();
        } else {
          // Create a new entry

          const newEntry = new Attendence({
            userId: userId,
            checkInTime: new Date(updateEntry.checkIn),
            checkOutTime: new Date(updateEntry.checkOut),
            status: ["WAO"]
            // Add other fields as needed
          });

          // Save the new entry
          await newEntry.save();
        }
      }
    }
    await updateAttendance(userId._id);


    return res.status(200).json({
      "message": "Success"
    })
  } catch (err) {

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

//getting token 
const fetchAuthenticationToken = async () => {
  try {


    // Create a FormData instance
    const formData = new FormData();

    // Append the necessary fields
    formData.append("payload[api_key]", "b42aa4cc6ecaf34d87a2f90cce03675d");
    formData.append("payload[api_secret]", "7d0f16984dc0022b132de78eeda08b06");
    formData.append("header[nameSpace]", "authorize.token");
    formData.append("header[nameAction]", "token");
    formData.append("header[version]", "1.0");
    formData.append("header[requestId]", "9b3077b6-dfa6-46a1-bc04-93b3603db54d");
    formData.append("header[timestamp]", "2023-12-18T08:38:32.899649+00:00");

    // Make a POST request using Axios
    const data = await axios.post('https://api.us.crosschexcloud.com/', formData, {
      headers: {
        ...formData.getHeaders(), // Include the headers from FormData
      },
    })
    if (data.status !== 200) throw new Error("Token not found")
    return data.data.payload.token;

  } catch (error) {
    console.error("Error fetching authentication token:", error);
  }
};

//getting attandance records
const fetchAttendanceRecords = async (token, empCode, date) => {
  try {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(date)
    const utcDate = new Date(firstDay);
    const adjustedDate = new Date(utcDate.toLocaleString());
    const formattedBeginTime = adjustedDate.toISOString()
    // const formattedBeginTime = new Date(firstDay).toISOString().split('.')[0] + 'Z';
    // let formattedEndTime = new Date(lastDay).toISOString().split('.')[0] + 'Z';
    let formattedEndTime = new Date(new Date(lastDay).setHours(23, 59, 59, 59)).toISOString()

    const formData = new FormData();
    formData.append("header[nameSpace]", "attendance.record");
    formData.append("header[nameAction]", "getrecord");
    formData.append("header[version]", "1.0");
    formData.append("header[requestId]", "9b3077b6-dfa6-46a1-bc04-93b3603db54d");
    formData.append("header[timestamp]", `${new Date().toString()}`);
    formData.append("authorize[token]", token);
    formData.append("payload[begin_time]", formattedBeginTime);
    formData.append("payload[end_time]", formattedEndTime);
    formData.append("payload[order]", "asc");
    formData.append("payload[page]", "1");
    formData.append("payload[workno]", `${empCode}`);
    formData.append("payload[per_page]", "100");
    formData.append("payload[checktype]", "128");



    // Make a POST request using Axios
    // console.log("form data", formData);
    let allData = [];
    const data = await axios.post('https://api.us.crosschexcloud.com/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,

      },

    })
    if (data.status === 200) {
      allData = [...data.data.payload.list]
      // const final = formatAttendanceData(data.data.payload.list);
      // return [final, data.data];
    }
    let pageCount = 2;
    let failed = 0;
    let loopData;
    while (pageCount <= parseInt(data.data.payload.pageCount)) {
      const formData = new FormData();
      formData.append("header[nameSpace]", "attendance.record");
      formData.append("header[nameAction]", "getrecord");
      formData.append("header[version]", "1.0");
      formData.append("header[requestId]", "9b3077b6-dfa6-46a1-bc04-93b3603db54d");
      formData.append("header[timestamp]", `${new Date().toString()}`);
      formData.append("authorize[token]", token);
      formData.append("payload[begin_time]", formattedBeginTime);
      formData.append("payload[end_time]", formattedEndTime);
      formData.append("payload[order]", "asc");
      formData.append("payload[page]", `${pageCount}`);
      formData.append("payload[workno]", empCode);
      formData.append("payload[per_page]", "100");
      formData.append("payload[checktype]", "128");
      loopData = await axios.post('https://api.us.crosschexcloud.com/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,

        },

      })
      if (data.status === 200) {
        pageCount++;
        allData = [...allData, ...loopData.data.payload.list]

      }

    }
    return [formatAttendanceData(allData), loopData?.data]
  } catch (error) {
    console.error("Error fetching attendance records:", error);
  }
};
// format attanace
const formatAttendanceData = (attendanceData) => {
  const formattedData = [];

  attendanceData.forEach((record) => {
    const checkDate = new Date(record.checktime).toLocaleDateString();

    const existingEntry = formattedData.find((entry) => entry.date === checkDate);

    if (existingEntry) {
      existingEntry.checkOut = new Date(record.checktime);
    } else {
      formattedData.push({
        date: checkDate,
        employee: record.employee.first_name + " " + record.employee.last_name,
        checkIn: new Date(record.checktime),
        checkOut: new Date(record.checktime),
      });
    }
  });

  return formattedData;
};

function getFirstAndLastDayOfMonth(dateString) {
  const date = new Date(dateString);

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const formattedFirstDay = formatDate(firstDay);
  const formattedLastDay = formatDate(lastDay);

  return {
    firstDay: formattedFirstDay,
    lastDay: formattedLastDay
  };
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateWorkingHours(dateString, holidays) {

  const WORKING_HOURS_PER_DAY = 7;

  let totalWorkingHours = 0;

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const holidayDates = holidays.map(holiday => new Date(holiday).toDateString());

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month - 1, day);

    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.includes(currentDate.toDateString())) {
      totalWorkingHours += WORKING_HOURS_PER_DAY;
    }
  }

  return totalWorkingHours;
}

function countDaysBetween(startDateString, endDateString) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const timeDifference = endDate - startDate;

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference + 1;
}

function getWorkingDaysArray(startDateString, endDateString) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const workingDays = [];

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const localDateString = currentDate.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
      workingDays.push(localDateString);
    }

    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }


  return workingDays;
}

function findMissingCheckIn(attendenceList) {
  return attendenceList
    .filter(record => {
      const date = new Date(record.key);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      return !record.checkInTime && !isWeekend;
    })
    .map(record => record.key);
}

function getFirstAndLastDayOfMonthWithFullLastDay(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Get the year and month from the given date
  const year = date.getFullYear();
  const month = date.getMonth(); // Month is 0-indexed (0 = January, 11 = December)

  // First day of the month
  const firstDay = new Date(year, month, 1);

  // Last day of the month at 23:59:59.999
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59.999

  // Return formatted results
  return {
    firstDay: firstDay.toISOString(), // Full ISO format
    lastDay: lastDay.toISOString()    // Full ISO format with last moment
  };
}



