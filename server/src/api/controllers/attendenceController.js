const Attendence = require("../models/attendenceModel");

module.exports.createAttendence = async (req, res) => {
    console.log("Hitted");
    try{
        const checkInTime = new Date(req.body.checkInTime);
        // const timeZone = req.body.tz;
        const status = req.body.status;
        const startDay = new Date(new Date(checkInTime).setHours(0,0,0,0)).toISOString();
        const endDay = new Date(new Date(checkInTime).setHours(23,59,59,59)).toISOString();
        // return;
        console.log(startDay, endDay);
        const query = {
            $and: [{userId: req.user.id}, {checkInTime: {$gte: new Date(checkInTime), $lte: new Date(checkInTime)}}]
        }
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


module.exports.getAttendence = async (req, res)=> {
    try{

    }catch(err){

    }
}