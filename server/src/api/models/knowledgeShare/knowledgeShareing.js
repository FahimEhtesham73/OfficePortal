const {Schema, model} = require("mongoose")
const knowledgeShareingShcema = new Schema({
    author: [{name: String, oId: String}], // userid / username
    title: String, 
    knowledgeType: {type: String, enum: ['video', 'blog']}, //course will be blog
    knowledgeCategory: {type: String, enum: ['general', 'management', 'course'], default: "general"},
    thumbailLinks: String, // url
    categories: [{name: String, oId: String}], // 
    description: String, 
    isActive: {type: Boolean, default: true},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000"}
},{timestamps: true});

module.exports = model("knowledgeShareing", knowledgeShareingShcema);