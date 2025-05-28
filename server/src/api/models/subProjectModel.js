const {Schema, model} = require("mongoose")
const subProjectSchema = new Schema({
    projectDescription: String,
    projectOwner: String,
    projectCode: String,
    projectName: String,
    projectSuperVisor: [Schema.Types.ObjectId],
    projectLead: [Schema.Types.ObjectId],
    projectMembers: [Schema.Types.ObjectId],
    projectId: String,
    superVisorTime: Number,
    leadTime: Number,
    memberTime: Number,
    projectStartTime: Date,
    projectEndTime: Date,
    isCurrentlyActive: {type: Boolean, default: false},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})
subProjectSchema.index({projectCode:1})
module.exports = model("SubProject", subProjectSchema);