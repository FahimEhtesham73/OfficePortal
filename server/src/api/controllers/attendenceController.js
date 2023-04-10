const Attendence = require("../models/attendenceModel");

module.exports.createAttendence = async (req, res) => {
    try{
        const time = new Date(req.body.time).toISOString();
        const timeZone = req.body.tz;
        const startDay = new Date()
        const status = req.body.status;
        const isUserAlreadyPunchedIn = await Attendence.findOne({userId: req.user._id});
        if(isUserAlreadyPunchedIn) return res.status(400).json({"message": "User already punched in"});
        const userAttendence = new Attendence({
            userId: req.us
        })

    }catch(err){
        return res.status(500).json("Something went wrong");
        
    }
    const attendence = await new Attendence()
}