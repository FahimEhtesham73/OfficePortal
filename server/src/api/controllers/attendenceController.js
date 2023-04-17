const { validationResult } = require("express-validator");
const Attendence = require("../models/attendenceModel");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");
const User = require('../models/userModel');


module.exports.createAttendence = async (req, res) => {
    console.log("Hitted");
    try{
        console.log("shuvo");
        const checkInTime = new Date(req.body.checkInTime);
        // const timeZone = req.body.tz;
        const status = req.body.status;
        const startDay = new Date(new Date(checkInTime).setHours(0,0,0,0)).toISOString();
        const endDay = new Date(new Date(checkInTime).setHours(23,59,59,59)).toISOString();
        // return;
        // console.log(startDay, endDay);
        
        const isUserAlreadyPunchedIn = await Attendence.findOne({
            userId: req.user._id, 
            createdAt: {$gte: new Date(startDay).toISOString(), $lte: new Date(endDay).toISOString()}
        }).lean();
        console.log(isUserAlreadyPunchedIn);
        if(isUserAlreadyPunchedIn) return res.status(400).json({"message": "User already punched in"});
        const userAttendence = await new Attendence({
            userId: req.user._id,
            status: status,
            checkInTime: checkInTime,
            createdBy: req.user._id,
        }).save()

        return res.status(201).json({"message": "Punch In Successfully",info:userAttendence})

    }catch(err){
        console.log("err", err);
        return res.status(500).json({"message":"Something went wrong"});
        
    }
}

module.exports.getAttendences = async (req, res)=> {
    try{
        const errors = validationMessages(validationResult(req).mapped());
        if(isErrorFounds(errors)) return res.status(400).json(errors)
        const body = req.body;
        const limit = req.body.limit? parseInt(req.query.limit) : 10;
        const arg = {}
        const checkInTime = new Date(req.body.checkInTime);
        // req.body.checkInTime;

        
        const startDay = new Date(new Date(checkInTime).setHours(0,0,0,0)).toISOString();
        const endDay = new Date(new Date(checkInTime).setHours(23,59,59,59)).toISOString();
        
        const isPunchedIn = await Attendence.findOne({
            userId: req.user._id,
            createdAt: {$gte: new Date(startDay).toISOString(), $lte: new Date(endDay).toISOString()}
        }).select("-createdAt -updatedAt -createdBy -updatedBy -__v")
        // .lean();


        let todaysDate = new Date();

        arg['usersId'] = body['userId'] || req.user._id;
        arg['monthDateYear'] = body["monthDateYear"] ? new Date(body['monthDateYear']) : todaysDate;

    

        let dates = []
        let month = arg['monthDateYear'].getMonth()+1
        let year = arg['monthDateYear'].getFullYear()
        let days = arg['monthDateYear'].getDate()
        const firstDate = new Date(`01/${month}/${year}`).setHours(0,0,0,0);
        let lastDay = new Date(arg['monthDateYear'].getFullYear(), todaysDate.getMonth() + 1, 0).setHours(23,59,59,999);
        console.log(new Date(lastDay).toLocaleString());
       
        const allAttendence = await Attendence.find({
            userId: arg.usersId,
            checkInTime: {
                            $gte: new Date(firstDate).toISOString(),
                            $lte: new Date(lastDay).toISOString()
                        }
        }).select("-createdAt -updatedAt -createdBy -updatedBy -__v").lean()

        const userName = await User.findOne({_id: arg.usersId}).select("firstName").lean()
        
        for (let i =1; i <= days; i++){
            let name = `${month}/${i}/${year}`;
            dates.push(name)
        }

        let dateObj = {}
        for(let d of dates){
            dateObj[d] = {}
        }
        
        let obj = {}
        for(let att of allAttendence){
            let dateStringToLocale = att.checkInTime.toLocaleDateString().split(" ")[0];
            
            if(dateStringToLocale in dateObj){
                dateObj[dateStringToLocale] = {...att, name: userName?.firstName}
            }
        }

        let arr = [];
        for(let d in dateObj){
            arr.push({key: d,...dateObj[d]})
        }

        return res.status(200).json({"punched": isPunchedIn? isPunchedIn: "" ,"attendenceList": arr })

    }catch(err){
        console.log("err", err);
        return res.status(500).json({"message":"Something went wrong"});
    }
}

module.exports.updateAttendece = async(req, res) => {
    try{
        const erros = validationMessages(validationResult(req).mapped());
        if(isErrorFounds(erros)) return res.status(400).json({"errors": erros})
        const attendeceId = req.body.aId;
        const userId = req.body.userId;
        const data = {
            ...req.body.updateData,
        }

        const attendence = await Attendence.findOne({_id: attendeceId, userId: userId }).lean();
        console.log(attendence);
        if(!attendence) return res.status(404).json({"message": "Not found"});
        const updatedDoc = await Attendence.findOneAndUpdate({
            _id: attendeceId, userId: userId
        }, {$set: {
            ...data,
            updatedBy: req.user._id
        }},{new: true})
        .select({userId: 1, status:1, checkInTime: 1, checkOutTime: 1}).lean()

        return res.status(200).json({"message": "Updated successfully", data: updatedDoc})
    }catch(err){
        console.log("err", err);
        return res.status(500).json({"message":"Something went wrong"});

        
    }
}