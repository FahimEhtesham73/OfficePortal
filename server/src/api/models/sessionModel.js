const {Schema, model} = require("mongoose")
const sessionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    jwt: String,
    location: String,
    ipAddress: String,
    timeZone: String,
},{timestamps: true});

sessionSchema.index({"userId": 1}, {expireAfterSeconds: parseInt(process.env.SESSION_TIMEOUT)});


module.exports = model("Session", sessionSchema);