const {Schema, model, SchemaType} = require("mongoose")
const resetPasswordSchema = new Schema({
    userId: Schema.Types.ObjectId,
    token: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
    
},{timestamps: true})

resetPasswordSchema.index({"createdAt": 1}, {expireAfterSeconds: 3 * 60});


module.exports = model("ResetPassword", resetPasswordSchema);