const {Schema, model} = require("mongoose")
const attendenceSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", autopopulate: {select: 'firstName'}},
    checkInTime: Date,
    checkOutTime: Date,
    status: {type: [String], enum: ["WFH", "WAO", "HD", "WOH"]}, // IO, WFO, HD,
    // isWOH: Boolean,
    comments: String,
    isModified: {type: Boolean, default: false},
    modifiedCheckInTime : Date,
    modifiedCheckOutTime : Date,

    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
},{timestamps: true})


module.exports = model("Attendence", attendenceSchema);