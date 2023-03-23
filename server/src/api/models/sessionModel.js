const {Schema, model} = require("mongoose")
const sessionSchema = new Schema({
    email: String,
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    accessToken: String,
    refreshToken: String,
    location: String,
    ipAddress: String,
    timeZone: String,
},{timestamps: true})

module.exports = model("Session", sessionSchema);