const { validationResult } = require("express-validator");
const Holiday = require("../models/holidaySchema");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");

const User = require('../models/userModel')


module.exports.createHoliday = async (req, res) => {
    try {
        const holidayName = req.body.holidayName
        const holidayDate = req.body.holidayDate

        if (holidayName === "" || holidayDate === "") {
            return res.status(400).json({ message: "Fill all the fields" })
        }


        const newHoliday = await new Holiday({
            holidayName: holidayName,
            date: holidayDate
        }).save()

        return res.status(201).json({ "message": "Created Successfully" })

    } catch (err) {
        console.log("err", err);
        return res.status(500).json({ "message": "Something went wrong" });

    }
}

module.exports.allHoliday = async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({date:1})
        return res.status(200).json(holidays)
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"something went wrong on all user get function"})
    }
}

module.exports.singleHoliday = async (req, res) => {
    try {
        const id = req.params.id
        console.log("Param Id",id);
        const holidays = await Holiday.find({_id:id})
        return res.status(200).json(holidays)
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"something went wrong on all user get function"})
    }
}

module.exports.updateHoliday = async (req, res) => {
    try {
        // const errors = validationMessages(validationResult(req).mapped());
        // console.log(errors);
        // if (isErrorFounds(errors)) return res.status(400).json({ "message": errors })

        const holidayName = req.body.holidayName;
        const holidayDate = req.body.holidayDate
        if (holidayName === "" || holidayDate === "") {
            return res.status(400).json({ message: "Fill all the fields" })
        }
        const id = req.params.id;
        console.log("ID",holidayDate,holidayName);
        const updateHoliday = await Holiday.findByIdAndUpdate({ _id: id }, { $set: { holidayName, date: holidayDate } }, { new: true })
        // console.log(updateHoliday);
        return res.status(200).send(updateHoliday)


    } catch (e) {
        console.log(e);
        return res.status(500).json({message:"something went wrong on all user get function"})
    }
}

module.exports.deleteHoliday = async (req, res) => {
    const  id  = req.params.id;
    const holiday = await Holiday.findOne({_id:id});
    if (!holiday) return res.status(400).json({message:"Day not found"});
    const deletedHoliday = await Holiday.findOneAndDelete({_id:holiday._id});
    return res.status(200).json({message:"successfully deleted"});

}
