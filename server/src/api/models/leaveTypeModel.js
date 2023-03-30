const {Schema, model} = require("mongoose")
const leaveTypeSchema = new Schema({
    leaveCategory: {type: Schema.Types.ObjectId, ref: "Leave"},
    leaveName: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true});


module.exports = model("LeaveType", leaveTypeSchema);