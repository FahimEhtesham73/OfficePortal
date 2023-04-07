const {Schema, model} = require("mongoose")
const designationSchema = new Schema({
    name: String,
    createdBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"}
}, {timestamps: true})

module.exports = model("Designation", designationSchema);
