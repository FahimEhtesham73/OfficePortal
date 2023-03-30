const {Schema, model} = require("mongoose")
const attendenceSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    checkInTime: Date,
    checkOutTime: Date,
    status: String, // IO, WFO, HD,
    isWOH: Boolean,
    comments: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})

module.exports = model("Attendence", attendenceSchema);