const {Schema, model} = require("mongoose")
const rolePermissionSchema = new Schema({
    name: String,
    alias:String,
    module: String,
    description: String,
    isPublic: Boolean,
    roles: {type: [Schema.Types.ObjectId], ref: "Role"},
    individualAccess: {type: [Schema.Types.ObjectId], ref: "User"},
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User"}
    
},{timestamps: true})

module.exports = model("RolePermission", rolePermissionSchema);