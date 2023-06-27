const {Schema, model} = require("mongoose")
const taskSchema = new Schema({
    taskName: String,
    projectId: Schema.Types.ObjectId,
    projectCode: String,
    assignedMembers: [Schema.Types.ObjectId],
    // assignedBy: Schema.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    totalHour: Number,
    progess: Number,
    taskType: {type: String, enum: ["feature", "bug", "test", "reasearch", "meeting", "design", "others"], default: "others"},
    priority: {type: String, enum:["high", "medium", "low"], default: "low"},
    status: {type: String,
         enum:["open", "doing", "done", "pause"],
        default: "open"
        },
    additionalNotes: String, //details about the task or anything 
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    
},{timestamps: true})

taskSchema.index({"projectId": 1});
taskSchema.index({"taskName": "text"}); //for text searching in taskName

module.exports = model("projecttask", taskSchema);