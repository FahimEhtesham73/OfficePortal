const {Schema, model} = require("mongoose")
const KnowledgeCategorySchema = new Schema({
    categoryName: {type: String},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true})

module.exports = model("knowledgeCategory", KnowledgeCategorySchema);