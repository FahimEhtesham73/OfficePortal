const {Schema, model} = require("mongoose")
const roleSchema = new Schema({
    title: String,
    alias: String,
    description: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User"}
    
},{timestamps: true})

module.exports = model("Role", roleSchema);