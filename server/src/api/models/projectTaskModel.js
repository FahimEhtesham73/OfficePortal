const {Schema, model} = require("mongoose");
const { TASKSTATUSTYPES, TASKCATEGORY, TASKPRIORITIES } = require("../util/commonValues");
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
    taskType: {type: String, enum: TASKCATEGORY, default: "others"},
    priority: {type: String, enum:TASKPRIORITIES, default: "low"},
    status: {type: String,
         enum:TASKSTATUSTYPES,
        default: "todo"
        },
    additionalNotes: String, //details about the task or anything 
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    
},{timestamps: true})

taskSchema.index({"projectId": 1});
taskSchema.index({"taskName": "text"}); //for text searching in taskName

module.exports = model("projecttask", taskSchema);