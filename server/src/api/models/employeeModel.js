const {Schema, model} = require("mongoose")
const employeeSchema = new Schema({
    name: String,
    userId: {type: Schema.Types.ObjectId, ref: "User"} 
    // createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    // updatedBy: {type: Schema.Types.ObjectId, ref: "User"}
},{timestamps: true});

module.exports = model("Employee", employeeSchema);