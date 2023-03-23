const {Schema, model} = require("mongoose")
const userSchema = new Schema({
    email: String,
    role: {type: Schema.Types.ObjectId, ref: "Role"},
    isActive: String,
    lastLogin: Date,
    lastPasswordChange:Date,
    isEmailVerified: Boolean,
    isPermissionChanges:Boolean,
    isMFAEnabled:Boolean,
    updatedBy: Schema.Types.ObjectId
},{timestamps: true})
const modelName = "User";
module.exports = model("User", userSchema);