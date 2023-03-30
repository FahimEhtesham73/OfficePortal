const {Schema, model} = require("mongoose")
const leaveSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    leaveAmount: Number,
    leaveCategory: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true});


module.exports = model("Leave", leaveSchema);