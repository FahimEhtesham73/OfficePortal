const {Schema, model} = require("mongoose")
const sessionSchema = new Schema({
    email: String,
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    accessToken: String,
    location: String,
    ipAddress: String,
    timeZone: String,
},{timestamps: true});

sessionSchema.createIndex({"userId": 1});

module.exports = model("Session", sessionSchema);