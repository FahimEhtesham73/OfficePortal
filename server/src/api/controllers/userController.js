
const fs = require("fs");
const { readFile } = require("fs/promises");
const path = require("path");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Module = require("../models/moduleModel");
const Permission = require("../models/rolePermissionModel");
const Department = require("../models/departmentModel");
const Designation = require("../models/designationModel");
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
const multer = require("multer");
const TIME = parseInt(process.env.COOKIE_TTL);

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
        const user = await User.findOne({ email: email })
            .populate("role", "alias name")
            .populate("designation", "name")
            .populate("department", "name").lean();
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
        const userSession = await createSession(user._id, userSessionData);
        // const cookie = `_token=${token};samesite=strict; secure;path=/; expires:${new Date(Date.now() + TIME).toUTCString()};`
        res.cookie("_token", token, { secure: true, sameSite: true,expires: new Date(Date.now() + TIME,),  domain: process.env.DOMAINNAME});
        // res.setHeader("Set-Cookie", [cookie])
        // res.cookie("_info", jwt.sign(restUserInformation, "secret"),);
        res.cookie("_info", jwt.sign(restUserInformation, "secret"), {expires: new Date(Date.now() + TIME),  domain: process.env.DOMAINNAME});

        //{expires: new Date(Date.now() + parseInt(process.env.SESSION_TIMEOUT))}
        res.cookie("_sid", userSession._id, { expires: new Date(Date.now() + TIME),path: "/", httpOnly: true, secure: true, sameSite: true,  domain: process.env.DOMAINNAME});



        return res.status(200).json({ "userInformation": restUserInformation, "message": "successfully login" });
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
                        lastName: 1
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
        if(user._id.toString !== req.user._id.toString()) return res.status(400).json({"message": "Invalid Request"})
        const newPassword = req.body.newPassword;
        const currentPassword = req.body.currentPassword;

        console.log("data", currentPassword, user.password);
        const isValidPass = await verifyHash(currentPassword, user?.password);
        if(!isValidPass) return res.status(400).json({"message": "Invalid password"})
        const newPasswordHash = await hashPasswordGenarator(newPassword);
    console.log("hased", newPasswordHash);
        await User.findOneAndUpdate({_id: user._id}, {$set: {password: newPasswordHash}});

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