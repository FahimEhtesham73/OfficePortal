const { Schema, model, default: mongoose } = require("mongoose")
const SnapShotSchema = new Schema({
    applicantId: { type: Schema.Types.ObjectId, ref: "User" },
    projectName: String,
    projectCode: { type: String, ref: "Project" },
    projectDescription: String,
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    startDate: Date,
    endDate: Date,
    totalHours: Number,
    applicantAns:[String],
    receiverAns: [String],
    checkinDuration: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
}, { timestamps: true });

// UserSchema.cre({"empId": 1})


module.exports = model("SnapShot", SnapShotSchema);