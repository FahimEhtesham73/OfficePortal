const {Schema, model} = require("mongoose")
const departmentSchema = new Schema({
    name: String,
    alias: String,
    head: {type: Schema.Types.ObjectId, ref: "User"},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})

module.exports = model("Department", departmentSchema);