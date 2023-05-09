
const fs = require("fs");
const path = require("path")
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Module = require("../models/moduleModel");
const Permission = require("../models/rolePermissionModel");
const Department = require("../models/departmentModel")
const Designation = require("../models/designationModel")
const monngoose = require('mongoose')
// const SubModule = require("../models/subModule");
const jwt = require("jsonwebtoken");
const { verifyHash, tokenGeneration, hashPasswordGenarator, createSession } = require("../services/userServices");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");


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
            .populate("role", "alias")
            .populate("designation", "name")
            .populate("department", "name").lean();
        if (!user) return res.status(400).json("wrong credential");
        let isValid = await verifyHash(password, user.password)
        if (!isValid) return res.status(400).json("wrong credential");
        const userTokenData = {
            "_id": user._id,
            "role": user.role,
        };
        const resourceInformation = {

        }
        const { password: p, createdAt, createdBy, updatedAt, updatedBy, ...restUserInformation } = user;
        const token = tokenGeneration(userTokenData);
        const userSessionData = {
            ipAddress: req.ip,
            jwt: token,
            timeZone: "",
        }
        const userSession = await createSession(user._id, userSessionData);
        const cookie = `_token=${token};samesite=strict; secure;path=/;`
        // res.cookie("_token", cookie, { expires: new Date(Date.now() + 43200*1000)});
        res.setHeader("Set-Cookie", [cookie])
        res.cookie("_info", jwt.sign(restUserInformation, "secret"),);//{expires: new Date(Date.now() + parseInt(process.env.SESSION_TIMEOUT))}
        res.cookie("_sid", userSession._id, { path: "/", secure: true, httpOnly: true, sameSite: true, });



        return res.status(200).json({ "userInformation": restUserInformation, "resourceInformation": resourceInformation, "message": "successfully login" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Something went wrong" })
    }

}

module.exports.deleteSingleUser = async (req, res) => {
    const { userid } = req.body;
    const user = await User.findOne(userid);
    if (!user) return res.status(400).json("user not found");
    await User.findOneAndDelete(userid);
    return res.status(200).json("successfully deleted");

}

module.exports.allUser = async (req, res) => {
    try {
        const users = await User.find().populate("designation", "name")
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
        console.log(req.user._id === id.toString() );
        if(req.user._id == id.toString() || req.user.role.alias === "Admin" ) {

            const updateUser = await User.findByIdAndUpdate({ _id: id }, {$set: {...data}}, { new: true }).populate("role", "alias")
                .populate("designation", "name")
                .populate("department", "name")
            console.log(updateUser);
            return res.status(200).json(updateUser)
        }
        
        else{
            return res.status(403).json({ "message": "Forbidden" }) 
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json("Something went wrong on update information")
    }
}

module.exports.searchUser = async (req, res) => {
    try {
        console.log(req.body);
        const erros = validationMessages(validationResult(req).mapped());
        if(isErrorFounds(erros)) return res.status(400).json({"errors": erros})
        const desgntn = req.body.desgId
        const userId = req.body.userId
        const empName = req.body.empName


        const matchQuery = {};
        if (userId) {
          matchQuery['empId'] = userId;
        }
        if (desgntn) {
          matchQuery['designation._id'] = new monngoose.Types.ObjectId(desgntn);
        }
        if (empName) {
          matchQuery['$or'] = [  { firstName: { $regex: empName, $options: 'i' } }, { lastName: { $regex: empName, $options: 'i' } } ];
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
        return res.status(500).json({"message":"Something went wrong"});
    }
}

module.exports.profileImgUpload = async(req, res)=> {
    try{
        const fileName = req.headers.filename;
        let contentLength = parseInt(req.headers['content-length'])
        if (isNaN(contentLength) || contentLength <= 0 ) {
          return res.status(411).json({"message": "no file found"})
        }        
        const writeStream = fs.createWriteStream(`/home/nsl52/SHUVO/projects/nsl_leave_system/nsl_leave/client/src/images/${fileName}`);
        writeStream.on("error", (err)=> {
            res.status(400).json({"message": "File not uploded"})
        })
        writeStream.on("finish", ()=> {
            writeStream.close()
            res.status(200).json({"message": "file uploded successfully"})
        })
        req.pipe(writeStream);

    }catch(e){
        console.log(e);
        return res.status(500).json("something went wrong on single user get function")
    }
}