const axios = require('axios');
const FormData = require('form-data');
const { validationResult } = require("express-validator");
const Attendence = require("../models/attendenceModel");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");

const User = require('../models/userModel');
const Snapshot = require('../models/snapshotModel');
const { isDateString } = require("../util/validator/commonValidation");


module.exports.createSnapShot = async (req, res) => {

  try {
    // const errors = validationMessages(validationResult(req).mapped());
    // if (isErrorFounds(errors)) return res.status(400).json({ "message": errors })

    const requestedBody = req.body

    const snapShot = await new Snapshot(requestedBody).save()

    return res.status(200).json({message:"SnapShot Created Successfully",snapShot})

  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ "message": "Something went wrong" });

  }
}


