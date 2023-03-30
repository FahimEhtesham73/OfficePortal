const {Schema, model} = require("mongoose")
const skillSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    skillName: String,
    type: String,
    level: String, //begainer/expert
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}

},{timestamps: true})

module.exports = model("Skill", skillSchema);