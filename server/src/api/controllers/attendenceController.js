const { validationResult } = require("express-validator");
const Attendence = require("../models/attendenceModel");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");

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
        const query = req.body;
        const limit = req.body.limit? parseInt(req.query.limit) : 10;
        const arg = {}
        const checkInTime = new Date()
        // req.body.checkInTime;

        
        const startDay = new Date(new Date(checkInTime).setHours(0,0,0,0)).toISOString();
        const endDay = new Date(new Date(checkInTime).setHours(23,59,59,59)).toISOString();
        
        const isPunchedIn = await Attendence.findOne({
            userId: req.user._id,
            createdAt: {$gte: new Date(startDay).toISOString(), $lte: new Date(endDay).toISOString()}
        }).lean().select({userId:1, status: 1, checkInTime: 1, checkOutTime: 1});

        for(let q in query){
            if(q === "usersId"){
                arg['usersId'] = query[q]
            }
            if(q === "month"){
                
            }
        }
        const allAttendence = await Attendence.find({
            userId:req.user._id
        })
        .select({userId:1, status:1, checkInTime:1, checkOutTime:1})
        .sort({checkInTime: 1})
        .limit(10)

        return res.status(200).json({"punched": isPunchedIn? isPunchedIn: "", "attendenceList": allAttendence })

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