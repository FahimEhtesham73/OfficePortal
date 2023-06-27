const {Schema, model} = require("mongoose")
const leaveSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    leaveAmount: Number,
    leaveCategory: {type: String, enum: ['sick', 'general']},
    yearStartDate: Date,
    yearEndDate: Date, 
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true});

module.exports = model("Leave", leaveSchema);