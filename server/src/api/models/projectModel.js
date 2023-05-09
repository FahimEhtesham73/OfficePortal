const {Schema, model} = require("mongoose")
const projectSchema = new Schema({
    projectName: String,
    projectSuperVisor: {type: Schema.Types.ObjectId, ref: "User"},
    projectLead: {type: Schema.Types.ObjectId, ref: "User"},
    projectMembers: [Schema.Types.ObjectId],
    projectStartTime: Date,
    projectEndTime: Date,
    isCurrentlyActive: {type: Boolean, default: true},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})

module.exports = model("Project", projectSchema);