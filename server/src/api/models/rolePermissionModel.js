const {Schema, model} = require("mongoose")
const rolePermissionSchema = new Schema({
    name: String, // ex: createVideoBlog|createTextBlog
    alias:String,
    moduleName: String, //knowledge
    moduleId: {type: Schema.Types.ObjectId, ref: "Module"},
    description: String,
    isPublic: {type: Boolean, default: false},
    roles: {type: [Schema.Types.ObjectId], ref: "Role"},
    individualAccess: {type: [Schema.Types.ObjectId], ref: "User"},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
    
},{timestamps: true})

module.exports = model("RolePermission", rolePermissionSchema);