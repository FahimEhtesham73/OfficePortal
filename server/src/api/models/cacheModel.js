const {Schema, model} = require("mongoose");
const cacheSchema = new Schema({
    key: String,
    value: Schema.Types.Mixed
})

module.exports = model("Cache", cacheSchema);