const { Schema, model } = require("mongoose")
const holidaySchema = new Schema({
    holidayName: String,
    date: Date,
    startDate: Date,
    endDate: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000" }
}, { timestamps: true });


module.exports = model("Holiday", holidaySchema);