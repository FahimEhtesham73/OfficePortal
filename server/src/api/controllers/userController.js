
const fs = require("fs");
const { readFile } = require("fs/promises");

const User = require("../models/userModel");
const Attendence = require("../models/attendenceModel.js")
const LateAttendance = require("../models/lateAtendanceModel")
const Project = require("../models/projectModel");
const ResetPassowrd = require("../models/passwordReset");
const Session = require("../models/sessionModel");
const monngoose = require('mongoose')
// const SubModule = require("../models/subModule");
const jwt = require("jsonwebtoken");
const { verifyHash, tokenGeneration, hashPasswordGenarator, createSession, verifyToken } = require("../services/userServices");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");

const TIME = parseInt(process.env.COOKIE_TTL);
const nodemailer = require('nodemailer');
const moment = require('moment');
const { firstMailMessage, secondMailMessage, thirdMailMessage } = require("../../../lib/messageConvert.js");
const { lateCountCalculate } = require("../../../lib/lateCountCalculate.js");


module.exports.createUser = async (req, res) => {
    try {
        console.log(req.cookies);
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": errors })
        const { firstName, lastName, email, password, designation, role, department, empId, joiningDate } = req.body;
        const user = await User.findOne({ email: email });
        if (user) return res.status(400).json("Employee already exist");

        const hashPassword = await hashPasswordGenarator(password)
        const userData = { firstName, lastName, email, password: hashPassword, designation, role, department, empId, joiningDate }

        const result = await new User(userData).save();
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Something went wrong");
    }
}

module.exports.signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log({email},{password});
        const user = await User.findOne({ email: email })
            .populate("role", "alias name")
            .populate("designation", "name")
            .populate("department", "name").lean();
        // console.log({user});
        if (!user) return res.status(400).json("wrong credential");
        let isValid = await verifyHash(password, user.password)
        if (!isValid) return res.status(400).json("wrong credential");
        const userTokenData = {
            "_id": user._id,
            "role": user.role,
        };

        const { password: p, createdAt, createdBy, updatedAt, updatedBy, ...restUserInformation } = user;
        const token = tokenGeneration(userTokenData);

        const userSessionData = {
            ipAddress: req.ip,
            jwt: token,
            timeZone: "",
        }
        // console.log("Token",token);
        const userSession = await createSession(user._id, userSessionData);
        // ${new Date(Date.now() + TIME)}
        // const expirationDate = new Date();
        // expirationDate.setSeconds(expirationDate.getSeconds() + 10);
        const cookie = `_token=${token};samesite=none;Secure; expires:${new Date(Date.now() + TIME)};`
        const infoCookie = `_info=${jwt.sign(restUserInformation, "secret")};samesite=none;Secure; expires:${new Date(Date.now() + TIME)};`
        // console.log(process.env.DOMAINNAME);
        res.setHeader('set-cookie', [cookie, infoCookie]);

        // res.cookie("_token", token, { domain: process.env.DOMAINNAME, sameSite: 'None', secure: true, expires: new Date(Date.now() + TIME) });
        // res.cookie("_info", jwt.sign(restUserInformation, "secret"), { domain: process.env.DOMAINNAME, sameSite: 'None', secure: true, expires: new Date(Date.now() + TIME) });

        return res.status(200).json({
            "userInformation": restUserInformation,
            "_token": token,
            "_info": jwt.sign(restUserInformation, "secret"),
            "message": "successfully login"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Something went wrong" })
    }

}

module.exports.deleteSingleUser = async (req, res) => {
    const { userid } = req.body;
    const user = await User.findOne({ _id: userid });
    console.log("Deleted User", user);
    if (!user) return res.status(400).json({ message: "user not found" });
    await User.findOneAndDelete({ _id: userid });
    return res.status(200).json({ message: "successfully deleted" });
}

module.exports.allUser = async (req, res) => {
    try {
        const role = req.query.role;
        console.log("role", req.query);
        const users = await User.aggregate([

            //     {$match: {$or: [ {
            //         role: new mongoose.Types.ObjectId(role) 
            //     }, {role: {$exists: true}}
            // ]
            // }

            // },

            {
                $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "roleDetails"
                }
            }
            ,
            {
                $unwind: "$roleDetails"
            },

            {
                $project: {
                    "password": 0,
                    //   "roleDetails.alias": 0,
                    "roleDetails.createdBy": 0,
                    "roleDetails.updatedBy": 0,

                }
            },


        ])
        return res.status(200).json(users)
    } catch (e) {
        console.log(e);
        return res.status(500).json("something went wrong on all user get function")
    }
}

module.exports.getSingleUser = async (req, res) => {
    try {
        const id = req.params.id
        const users = await User.find({ _id: id }).populate("role", "alias")
            .populate("designation", "name")
            .populate("department", "name")
            .select({ password: 0, updatedAt: 0, createdAt: 0, updatedBy: 0 }).lean()

        // console.log(users[0].imagePath);
        // const imageBase64 = await readFile(users[0].imagePath, {encoding: "base64"});
        // console.log(imageBase64);
        // users[0].imageBase64 = imageBase64
        return res.status(200).json(users)
    } catch (e) {
        console.log(e);
        return res.status(500).json("something went wrong on single user get function")
    }
}

module.exports.updateSingleUser = async (req, res) => {
    try {
        const errors = validationMessages(validationResult(req).mapped());
        console.log(errors);
        if (isErrorFounds(errors)) return res.status(400).json({ "message": errors })
        const data = req.body;
        const id = req.params.id;
        console.log(req.user);
        console.log(req.user._id === id.toString());
        if (req.user._id == id.toString() || req.user.role.alias === "Admin") {

            const updateUser = await User.findByIdAndUpdate({ _id: id }, { $set: { ...data, isProfileUpdate: true } }, { new: true }).populate("role", "alias")
                .populate("designation", "name")
                .populate("department", "name")
            console.log(updateUser);
            return res.status(200).json({ "message": "User info updated successfully" })
        }

        else {
            return res.status(403).json({ "message": "Forbidden" })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json("Something went wrong on update information")
    }
}

module.exports.searchUser = async (req, res) => {
    try {

        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
        const desgntn = req.body.desgId
        const userId = req.body.userId
        const empName = req.body.empName.trim()
        const roles = req.body.roles

        const matchQuery = {};
        if (userId) {
            matchQuery['empId'] = userId;
        }
        if (desgntn) {
            matchQuery['designation._id'] = new monngoose.Types.ObjectId(desgntn);
        }
        if (empName) {
            matchQuery['$or'] = [{ firstName: { $regex: empName, $options: 'i' } }, { lastName: { $regex: empName, $options: 'i' } }, { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: empName, options: 'i' } } }];
        }

        const result = await User.aggregate([
            {
                $lookup: {
                    from: "designations",
                    localField: "designation",
                    foreignField: "_id",
                    as: "designation"
                }
            },
            { $unwind: '$designation' },
            { $match: matchQuery },



        ])
        console.log(matchQuery);

        return res.status(200).send(result)

    } catch (e) {
        console.log(e);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

module.exports.profileImgUpload = async (req, res) => {
    try {
        const fileName = req.headers.filename;
        let contentLength = parseInt(req.headers['content-length'])
        if (isNaN(contentLength) || contentLength <= 0) {
            return res.status(411).json({ "message": "no file found" })
        }
        const writeStream = fs.createWriteStream(`/home/nsl52/SHUVO/projects/nsl_leave_system/nsl_leave/client/src/images/${fileName}`);
        writeStream.on("error", (err) => {
            res.status(400).json({ "message": "File not uploded" })
        })
        writeStream.on("finish", () => {
            writeStream.close()
            res.status(200).json({ "message": "file uploded successfully" })
        })
        req.pipe(writeStream);

    } catch (e) {
        console.log(e);
        return res.status(500).json("something went wrong on single user get function")
    }
}

module.exports.fileUpload = async (req, res) => {
    try {
        if (req.fileValidationError) return res.status(400).json({ "message": req.fileValidationError })
        const type = req.body.type;
        console.log(type);
        const user = await User.findOne({ _id: req.body.userId }).lean();
        if (!user) return res.status(400).json({ "message": "user not found" });

        const data = {};
        console.log(req.body);
        if (type == "img") {
            data.imagePath = req.userPath;
            data.isProfileUpdate = true;

        } else if (type === "cv") {
            data.cvPath = req.userPath;
        }
        // console.log("data", data);

        const result = await User.findByIdAndUpdate({ _id: req.body.userId }, {
            $set: {
                ...data
            }
        })
        return res.status(200).json({ "message": "file uploaded successfully" });

    } catch (err) {

        return res.status(500).json({ "message": "Something went wrong" });
    }
}

module.exports.viewCv = async (req, res) => {
    try {
        console.log(req.body);
        const userId = req.body.userId;
        const user = await User.findById({ _id: userId }).lean();
        if (!user?.cvPath) return res.status(400).json({ "message": "data not found" });
        console.log(user.cvPath);
        let data = await readFile(user?.cvPath, { encoding: "base64" })
        return res.status(200).json({ "data": data })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

module.exports.viewImage = async (req, res) => {
    const { filename } = req.params;
    const user = await User.findOne({ _id: req.query.id }).lean();
    const filePath = user.imagePath;

    console.log(filePath);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Set the appropriate content type based on the file extension
        //   const contentType = getContentType(filename);
        res.set('Content-Type', "image/png");

        // Read the file and send it as a response
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).json({ message: 'Image not found' });
    }
};

module.exports.getUserUnderSuperVisorOrTemlead = async (req, res) => {
    try {
        const role = req.user.role.name;

        let matchStage
        let projectStage
        let lookupStage
        let unwindStage
        let groupStage
        let lastProjectStage

        if (role === "teamlead") {
            matchStage = {
                $match: {
                    $or: [
                        {
                            projectLead: new mongoose.Types.ObjectId(req.user._id)
                        }
                    ]

                }
            }

            //project stage
            projectStage = {
                $project: {
                    projectMembers: 1
                }
            }

            //unwind stage
            unwindStage = [{
                $unwind: { path: "$projectMembers" }
            }]

            //group stage
            groupStage = {
                $group: {
                    _id: null,
                    projectMembers: { $addToSet: "$projectMembers" }
                }
            }

            //lookup stage
            lookupStage = {
                $lookup: {
                    from: "users",
                    localField: "projectMembers",
                    foreignField: "_id",
                    as: "memberDetails"
                }
            }

            const userUnder = await Project.aggregate([
                matchStage,
                projectStage,
                ...unwindStage,
                groupStage,
                lookupStage,
                {
                    $project: {
                        _id: 0,
                        isActive: 1,
                        result: {
                            $map: {
                                input: "$memberDetails",
                                as: "item",
                                in: {
                                    _id: "$$item._id",
                                    email: "$$item.email",
                                    firstName: "$$item.firstName",
                                    lastName: "$$item.lastName",
                                }

                            }
                        }
                    }
                }

            ])
            return res.status(200).json({ "message": "success", data: userUnder })
        }

        if (role === "projectlead") {
            //matchstage
            matchStage = {
                $match: {
                    $or: [
                        {
                            projectSuperVisor: new mongoose.Types.ObjectId(req.user._id)
                        }
                    ]

                }
            }

            //project stage
            projectStage = {
                $project: {
                    projectMembers: 1,
                    projectLead: 1
                }
            }

            //unwind stage
            unwindStage = [{ $unwind: { path: "$projectMembers" } }, { $unwind: { path: "$projectLead" } }]

            //group stage
            groupStage = {
                $group: {
                    _id: null,
                    data: {
                        $addToSet: {
                            $concatArrays: [
                                { $cond: { if: "$projectLead", then: ["$projectLead"], else: [] } },
                                { $cond: { if: "$projectMembers", then: ["$projectMembers"], else: [] } }
                            ]
                        }
                    }
                }
            }

            //lookup stage
            lookupStage = {
                $lookup: {
                    from: "users",
                    localField: "result",
                    foreignField: "_id",
                    as: "memberDetails"
                }
            }

            //lastp projectStage 
            lastProjectStage = {
                $project: {
                    "memberDetails._id": 1
                }
            }


            const userUnder = await Project.aggregate([
                matchStage,
                projectStage,
                ...unwindStage,
                groupStage,
                {
                    $unwind: "$data"
                },
                {
                    $unwind: "$data"
                },
                {
                    $group: {
                        _id: null,
                        result: {
                            $addToSet: "$data"
                        }
                    }
                },
                lookupStage,
                {
                    $project: {
                        _id: 0,
                        result: {
                            $map: {
                                input: "$memberDetails",
                                as: "item",
                                in: {
                                    _id: "$$item._id",
                                    email: "$$item.email",
                                    firstName: "$$item.firstName",
                                    lastName: "$$item.lastName",
                                    empId: "$$item.empId"


                                }

                            }
                        }
                    }
                },
                // {$unwind: "$newData"}


            ])

            return res.status(200).json({ message: "success", data: userUnder });



        }

        if (role === "admin") {
            const userUnder = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: new mongoose.Types.ObjectId(req.user._id) }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        empId: 1,
                        isActive: 1
                    }
                }])
            return res.status(200).json({ "message": "success", data: [{ result: userUnder }] })

        }

        return res.status(400).json({ "message": "unsuccessfull" })




    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

module.exports.passwordReset = async (req, res, next) => {
    try {
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "errors": errors })
        console.log(req.body);
        const userId = req.body.userId;
        const user = await User.findOne({ _id: userId }).lean();
        // if(userId !== req.user._id) return res.status(403).json({"message": "Invalid request"}) 
        if (!user) return res.status(400).json({ 'message': "User not found" });
        const email = user.email;
        if (!email) return res.status(400).json({ 'message': "User email not found" });
        if (user._id.toString() !== req.user._id.toString()) return res.status(400).json({ "message": "Invalid Request" })
        const newPassword = req.body.newPassword;
        const currentPassword = req.body.currentPassword;

        const isValidPass = await verifyHash(currentPassword, user?.password);
        if (!isValidPass) return res.status(400).json({ "message": "Invalid password" })
        const newPasswordHash = await hashPasswordGenarator(newPassword);
        console.log("hased", newPasswordHash);
        await User.findOneAndUpdate({ _id: user._id }, { $set: { password: newPasswordHash } });

        return res.status(200).json({ 'message': "password updated successfully" })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports.resetConfirmation = async (req, res, next) => {
    try {
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "errors": errors })
        const userId = req.body.userId;
        const token = req.body.token;
        const password = req.body.password;
        const user = await User.findOne({ _id: userId }).lean();
        if (!user) return res.status(400).json({ "message": "Invalid request" })
        const isValid = verifyToken(token);
        if (!isValid) return res.status(400).json({ "message": "Invalid Token or token expired" });
        const hashPassword = await hashPasswordGenarator(password);
        await User.updateOne({ _id: user }, { $set: { password: hashPassword } });
        await Session.deleteOne({ userId })
        await ResetPassowrd.deleteOne({ userId })

        return res.status(200).json({ "message": "Password updated successfully" });

    } catch (err) {
        console.log(err);
        next(err)
    }
}

// let lateAttendance = await LateAttendance.findOne({ userId: user._id });

// let lateRecordResponse

// lateRecordResponse = lateAttendance.monthlyLateRecords.filter((val,index)=>{
//     if(val.month === currentDate){
//         return val.lateCount
//     }
// })

// console.log({lateRecordResponse});

// module.exports.checkLatenessAndSendEmailss = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const user = await User.findById(userId);
//         const date = new Date(req.body.month);

//         if (!user) {
//             console.error("User not found");
//             return res.status(404).json({ message: "User not found" });
//         }

//         // const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
//         // const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//         const startDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
//         const endDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
//         // console.log({ startDate }, { endDate });

//         const currentDate = endDate.toISOString().substring(0, 7);
//         console.log({currentDate});

//         const monthName = date.toLocaleString('default', { month: 'long' });

//         const attendanceRecords = await Attendence.find({
//             userId: user._id,
//             checkInTime: {
//                 $gte: startDate,
//                 $lte: endDate,
//             },
//         });

//         // console.log({ attendanceRecords });


//         const lateRecords = attendanceRecords.filter(record =>
//             moment(record.checkInTime).isAfter(
//                 moment(record.checkInTime).set({ hour: 8, minute: 35 })
//             )
//         );

//         // console.log({ lateRecords });

//         const subject = "Disciplinary Guideline Notice"

//         let lateAttendance = await LateAttendance.findOne({ userId: user._id });

//         if (lateRecords.length > 0) {
//             if (!lateAttendance) {
//                 lateAttendance = new LateAttendance({ userId: user._id });
//             }

//             const currentMonth = currentDate;

//             let monthlyRecord = lateAttendance.monthlyLateRecords.find(
//                 record => record.month === currentMonth
//             );

//             if (!monthlyRecord) {

//                 // Initialize with lateCount set to lateRecords.length for the first time
//                 monthlyRecord = { month: currentMonth, lateCount: lateRecords.length, prevLateCount: lateRecords.length, emailSentDates: [] };
//                 lateAttendance.monthlyLateRecords.push(monthlyRecord);

//                 let emailMessage = "";
//                 const groupKey = getMonthGroup(date);

//                 if (monthlyRecord.lateCount === 1) {
//                     emailMessage = firstMailMessage(user.firstName, monthName);
//                     monthlyRecord.emailSentDates.push(new Date());
//                 } else if (monthlyRecord.lateCount === 2) {
//                     emailMessage = secondMailMessage(user.firstName, monthName);
//                     monthlyRecord.emailSentDates.push(new Date());
//                 } else if (monthlyRecord.lateCount >= 3) {
//                     emailMessage = thirdMailMessage(user.firstName, monthName, monthlyRecord.lateCount);

//                     // Initialize or increment disciplinaryActionCount for the group
//                     if (!lateAttendance.disciplinaryActionCounts[groupKey]) {

//                         lateAttendance.disciplinaryActionCounts[groupKey] = 1;
//                     } else {
//                         lateAttendance.disciplinaryActionCounts[groupKey]++;
//                     }
//                     monthlyRecord.emailSentDates.push(new Date());
//                 }

//                 if (emailMessage) {
//                     await sendEmail(user.email, subject, emailMessage);
//                 }

//                 lateAttendance.markModified('monthlyLateRecords');
//                 lateAttendance.markModified('disciplinaryActionCounts');

//                 // Ensure repeated lateness records are tracked properly
//                 const repeatedLatenessRecords = lateAttendance.monthlyLateRecords.filter(
//                     record =>
//                         getMonthGroup(new Date(record.month + '-01')) === getMonthGroup(date) &&
//                         record.lateCount >= 3
//                 );

//                 if (repeatedLatenessRecords.length >= 2 && lateAttendance.disciplinaryActionCounts[groupKey] === 2) {
//                     // lateAttendance.disciplinaryActionCounts[groupKey]++;
//                     await sendEmail(
//                         user.email,
//                         "Continued Lateness Notice",
//                         "You have continued to be late multiple times over several months. Further disciplinary action may be taken."
//                     );
//                 }

//                 // console.log("Final", { lateAttendance });

//                 // Attempt to save and check for errors
//                 // lateCount:lateAttendance.monthlyLateRecords.lateCount
//                 try {
//                     await lateAttendance.save();
//                     console.log("Save successful");
//                     return res.status(200).json({ message: "Warning sent successfully",   });
//                 } catch (saveError) {
//                     console.error("Error saving document:", saveError);
//                     return res.status(500).json({ message: "Failed to save attendance record." });
//                 }

//             } else {
//                 const previousLateCount = monthlyRecord.prevLateCount;
//                 const newLateCount = lateRecords.length;

//                 if (newLateCount > previousLateCount) {
//                     monthlyRecord.prevLateCount = newLateCount
//                     const counter = newLateCount - previousLateCount
//                     monthlyRecord.lateCount = monthlyRecord.lateCount + counter;

//                     let emailMessage = "";
//                     const groupKey = getMonthGroup(date);

//                     if (monthlyRecord.lateCount === 1 && !monthlyRecord.emailSentDates.includes(1)) {
//                         emailMessage = firstMailMessage(user.firstName, monthName);
//                         monthlyRecord.emailSentDates.push(new Date());
//                     } else if (monthlyRecord.lateCount === 2 && !monthlyRecord.emailSentDates.includes(2)) {
//                         emailMessage = secondMailMessage(user.firstName, monthName);
//                         monthlyRecord.emailSentDates.push(new Date());
//                     } else if (monthlyRecord.lateCount >= 3 && !monthlyRecord.emailSentDates.includes(3)) {
//                         emailMessage = thirdMailMessage(user.firstName, monthName, monthlyRecord.lateCount);;

//                         // Increment the disciplinary action count for the group
//                         if (!lateAttendance.disciplinaryActionCounts[groupKey]) {
//                             lateAttendance.disciplinaryActionCounts[groupKey] = 1;
//                         } else {
//                             if (monthlyRecord.lateCount === 3) {
//                                 lateAttendance.disciplinaryActionCounts[groupKey]++;
//                             }
//                         }

//                         monthlyRecord.emailSentDates.push(new Date());
//                     }

//                     if (emailMessage) {
//                         await sendEmail(user.email, subject, emailMessage);
//                     }

//                     lateAttendance.markModified('monthlyLateRecords');
//                     lateAttendance.markModified('disciplinaryActionCounts');

//                     // Ensure repeated lateness records are tracked properly
//                     const repeatedLatenessRecords = lateAttendance.monthlyLateRecords.filter(
//                         record =>
//                             getMonthGroup(new Date(record.month + '-01')) === getMonthGroup(date) &&
//                             record.lateCount >= 3
//                     );

//                     if (repeatedLatenessRecords.length >= 2 && lateAttendance.disciplinaryActionCounts[groupKey] < 2) {
//                         lateAttendance.disciplinaryActionCounts[groupKey]++;
//                         await sendEmail(
//                             user.email,
//                             "Continued Lateness Notice",
//                             "You have continued to be late multiple times over several months. Further disciplinary action may be taken."
//                         );
//                     }
//                     await lateAttendance.save();
//                     return res.status(200).json({ message: "Warning sent successfully", lateCount:lateAttendance.monthlyLateRecords.lateCount });
//                 } else {

//                     return res.status(200).json({ message: "No new late records to process.", lateCount:lateAttendance.monthlyLateRecords.lateCount });
//                 }
//             }
//         } else {
//             return res.status(200).json({ message: "No late records found for this user." });
//         }
//     } catch (error) {
//         console.error("Error checking lateness for user and sending emails:", error);
//         return res.status(500).json({ message: "An error occurred while checking lateness." });
//     }
// };

module.exports.checkLatenessAndSendEmails = async (req, res) => {
    // console.log("Entered MAilssssssssssss");
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        const date = new Date(req.body.month);

        // console.log("From MAiillsssssssssssssssssss",{date});

        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const startDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
        const endDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

        const currentYear = date.getUTCFullYear();
        const currentMonth = endDate.toISOString().substring(0, 7); // "YYYY-MM"

        const monthName = date.toLocaleString('default', { month: 'long' });

        // Fetch attendance records for the current month
        const attendanceRecords = await Attendence.find({
            userId: user._id,
            checkInTime: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        const lateRecords = attendanceRecords.filter(record =>
            moment(record.checkInTime).isAfter(
                moment(record.checkInTime).set({ hour: 9, minute: 5 })
            )
        );

        console.log({lateRecords});
        

        const subject = "Disciplinary Guideline Notice";

        // Find if there's an existing LateAttendance for this user and year
        let lateAttendance = await LateAttendance.findOne({
            userId: user._id,
            year: currentYear // Now tracking by year
        });

        if (lateRecords.length > 0) {

            // Create a new LateAttendance document for a new year
            if (!lateAttendance) {
                lateAttendance = new LateAttendance({
                    userId: user._id,
                    year: currentYear, // Track by year
                    monthlyLateRecords: []
                });
            }

            let monthlyRecord = lateAttendance.monthlyLateRecords.find(
                record => record.month === currentMonth
            );

            if (!monthlyRecord) {
                // Initialize a new monthly record if it doesn't exist
                monthlyRecord = { month: currentMonth, lateCount: lateRecords.length, prevLateCount: lateRecords.length, emailSentDates: [] };
                lateAttendance.monthlyLateRecords.push(monthlyRecord);

                let emailMessage = "";
                const groupKey = getMonthGroup(date); // Include year in groupKey

                if (monthlyRecord.lateCount === 1) {
                    emailMessage = firstMailMessage(user.firstName, monthName);
                    monthlyRecord.emailSentDates.push(new Date());
                } else if (monthlyRecord.lateCount === 2) {
                    emailMessage = secondMailMessage(user.firstName, monthName);
                    monthlyRecord.emailSentDates.push(new Date());
                } else if (monthlyRecord.lateCount >= 3) {
                    emailMessage = thirdMailMessage(user.firstName, monthName, monthlyRecord.lateCount);

                    // Initialize or increment disciplinaryActionCount for the group (now tracking year)
                    if (!lateAttendance.disciplinaryActionCounts[groupKey]) {
                        lateAttendance.disciplinaryActionCounts[groupKey] = 1;
                    } else {
                        lateAttendance.disciplinaryActionCounts[groupKey]++;
                    }
                    monthlyRecord.emailSentDates.push(new Date());
                }

                if (emailMessage) {
                    await sendEmail(user.email, subject, emailMessage);
                }

                lateAttendance.markModified('monthlyLateRecords');
                lateAttendance.markModified('disciplinaryActionCounts');

                let lateRecordResponseCount = lateCountCalculate(lateAttendance, currentMonth)

                // Track repeated lateness within the same year and month group
                const repeatedLatenessRecords = lateAttendance.monthlyLateRecords.filter(
                    record =>
                        getMonthGroup(new Date(record.month + '-01')) === getMonthGroup(date) &&
                        record.lateCount >= 3
                );

                if (repeatedLatenessRecords.length >= 2 && lateAttendance.disciplinaryActionCounts[groupKey] === 2) {
                    await sendEmail(
                        user.email,
                        "Continued Lateness Notice",
                        "You have continued to be late multiple times over several months. Further disciplinary action may be taken."
                    );
                }

                try {
                    await lateAttendance.save();
                    return res.status(200).json({ message: "Warning sent successfully", lateCount: lateRecordResponseCount });
                } catch (saveError) {
                    console.error("Error saving document:", saveError);
                    return res.status(500).json({ message: "Failed to save attendance record." });
                }

            } else {
                // Handle updating existing records within the same year and month
                const previousLateCount = monthlyRecord.prevLateCount;
                const newLateCount = lateRecords.length;

                if (newLateCount > previousLateCount) {
                    monthlyRecord.prevLateCount = newLateCount;
                    const counter = newLateCount - previousLateCount;
                    monthlyRecord.lateCount += counter;

                    let emailMessage = "";
                    const groupKey = `${currentYear}-${getMonthGroup(date)}`; // Group key with year

                    if (monthlyRecord.lateCount === 1 && !monthlyRecord.emailSentDates.includes(1)) {
                        emailMessage = firstMailMessage(user.firstName, monthName);
                        monthlyRecord.emailSentDates.push(new Date());
                    } else if (monthlyRecord.lateCount === 2 && !monthlyRecord.emailSentDates.includes(2)) {
                        emailMessage = secondMailMessage(user.firstName, monthName);
                        monthlyRecord.emailSentDates.push(new Date());
                    } else if (monthlyRecord.lateCount >= 3 && !monthlyRecord.emailSentDates.includes(3)) {
                        emailMessage = thirdMailMessage(user.firstName, monthName, monthlyRecord.lateCount);

                        // Increment the disciplinary action count (per year)
                        if (!lateAttendance.disciplinaryActionCounts[groupKey]) {
                            lateAttendance.disciplinaryActionCounts[groupKey] = 1;
                        } else {
                            if (monthlyRecord.lateCount === 3) {
                                lateAttendance.disciplinaryActionCounts[groupKey]++;
                            }
                        }

                        monthlyRecord.emailSentDates.push(new Date());
                    }

                    if (emailMessage) {
                        await sendEmail(user.email, subject, emailMessage);
                    }

                    lateAttendance.markModified('monthlyLateRecords');
                    lateAttendance.markModified('disciplinaryActionCounts');

                    const repeatedLatenessRecords = lateAttendance.monthlyLateRecords.filter(
                        record =>
                            getMonthGroup(new Date(record.month + '-01')) === getMonthGroup(date) &&
                            record.lateCount >= 3
                    );

                    if (repeatedLatenessRecords.length >= 2 && lateAttendance.disciplinaryActionCounts[groupKey] < 2) {
                        lateAttendance.disciplinaryActionCounts[groupKey]++;
                        await sendEmail(
                            user.email,
                            "Continued Lateness Notice",
                            "You have continued to be late multiple times over several months. Further disciplinary action may be taken."
                        );
                    }
                    await lateAttendance.save();

                    let lateRecordResponseCount = lateCountCalculate(lateAttendance, currentMonth)
                    return res.status(200).json({ message: "Warning sent successfully", lateCount: lateRecordResponseCount });
                } else {
                    let lateRecordResponseCount = lateCountCalculate(lateAttendance, currentMonth)
                    return res.status(200).json({ message: "No new late records to process.", lateCount: lateRecordResponseCount });
                }
            }
        } else {
            let lateRecordResponseCount = lateCountCalculate(lateAttendance, currentMonth)
            return res.status(200).json({ message: "No late records found for this user.", lateCount: lateRecordResponseCount });
        }
    } catch (error) {
        console.error("Error checking lateness for user and sending emails:", error);
        return res.status(500).json({ message: "An error occurred while checking lateness." });
    }
};


// Utility function to determine the month group
function getMonthGroup(date) {
    const month = date.getMonth();
    if (month >= 0 && month <= 2) return '0-2'; // January-March
    if (month >= 3 && month <= 5) return '3-5'; // April-June
    if (month >= 6 && month <= 8) return '6-8'; // July-September
    if (month >= 9 && month <= 11) return '9-11'; // October-December
}
// noreplyDox876?

async function sendEmail(to, subject, text) {

    // Configure the transporter with SMTP settings
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        cc: 'shazzad@nextsolutionlab.com'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        // res.status(200).send({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Error sending email:', error);
        // res.status(500).send({ message: 'Error sending email', error });
    }
}

module.exports.updateDisiplinaryActions = async (req, res) => {
    // const KEY = "disciplinaryActionCounts"
    try {
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": errors });

        const userId = req.body.userId;
        const lateAttendanceId = req.body.lateAId;
        const year_month = req.body.date;
        const currentMonth = new Date(year_month).getMonth() + 1;
        const currentDate = new Date(year_month).toISOString().substring(0, 7);

        let keyToUpdate;
        if (currentMonth >= 1 && currentMonth <= 2) {
            keyToUpdate = "0-2";
        } else if (currentMonth >= 3 && currentMonth <= 5) {
            keyToUpdate = "3-5";
        } else if (currentMonth >= 6 && currentMonth <= 8) {
            keyToUpdate = "6-8";
        } else if (currentMonth >= 9 && currentMonth <= 11) {
            keyToUpdate = "9-11";
        }



        let result = await LateAttendance.findOne({ userId: userId, _id: lateAttendanceId });

        // console.log(currentDate === "2024-08");
        for (let item of result['monthlyLateRecords']) {
            if (item.month === currentDate) {

                if (item.lateCount === 3) {
                    result['disciplinaryActionCounts'][keyToUpdate]--;
                }
                if (item.lateCount > 0) {
                    item.lateCount -= 1;
                }
            }
        }

        let dac = result['disciplinaryActionCounts'];
        let la = result['monthlyLateRecords'];


        await LateAttendance.findOneAndUpdate({ userId: userId, _id: lateAttendanceId }, {
            $set: {
                disciplinaryActionCounts: dac,
                monthlyLateRecords: la
            }
        })

        return res.status(200).json({ "message": "successfully update disiplinary actions", "data": result })

    } catch (err) {
        if (err.message === "dateNotFound") {
            return res.status(400).json({ "message": "Month not found to decrease the count" })
        }
        if (err.message === "zerovalue") {
            return res.status(400).json({ "message": "Late count already zero" })

        }
        return res.status(500).json({ message: "Error occured during" });
    }
}

module.exports.getDisiplinaryActions = async (req, res) => {
    try {

        const year = req.query.year;
        const userId = req.query.userId;
        const result = await LateAttendance.findOne({
            userId: userId,
            "monthlyLateRecords": {
                $elemMatch: {
                    month: { $regex: `^${year}` } // Matches any month starting with the year 2024
                }
            }

        })

        return res.status(200).json({ "message": "successfully ", "data": result })

    } catch (err) {
        return res.status(500).json({ message: "Error occured during finding actions" });
    }
}