const {Schema, model} = require("mongoose")
const subModuleSchema = new Schema({
    moduleId: {type: Schema.Types.ObjectId, ref: "Module"},
    moduleName: String,
    alias: String,
    accessRoles: [String],
    isPublic: true,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
    
},{timestamps: true})

module.exports = model("SubModule", subModuleSchema);