const {Schema, model} = require("mongoose")
const leaveRequestSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    leaveType: {type: Schema.Types.ObjectId, ref: "LeaveType"},
    approvedBy: [Schema.Types.ObjectId],
    startDate: Date,
    endDate: Date,
    isFullyApproved: Boolean,
    leaveReason: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true});


module.exports = model("LeaveRequest", leaveRequestSchema);