const {Schema, model} = require("mongoose")
const KnowledgeShareMetadataSchema = new Schema({
    knowledgeShareId: {type: Schema.Types.ObjectId},
    link: String,
    priority:String, 
    fileType: String, // pdf , image , videoo
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})

module.exports = model("fileMetadata", KnowledgeShareMetadataSchema);