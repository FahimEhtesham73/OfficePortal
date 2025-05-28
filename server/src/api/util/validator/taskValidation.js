const {body, check} = require("express-validator");
const { isObjectIdOrHexString, default: mongoose } = require("mongoose");
const { isDateString } = require("./commonValidation");
// const TASKSTATUS = ["todo", "in progress", "done", "pause"]
const {TASKCATEGORY, TASKPRIORITIES, TASKSTATUSTYPES} = require("../commonValues")
module.exports.taskCreationValidation = [
    body("taskName").notEmpty().isString(),
    // body("projectCode").notEmpty().isString(),
    body("projectCode").custom(v=> {
        if(v){
            return typeof v === 'string'
        }
        return true;

    }),
    body("assignedMembers").custom(v=> {
        if(v){
           let isValid =  v.every(i=> isObjectIdOrHexString(i) )
           return isValid
        }
        return true;
    }),
    body("startTime").custom(v=> isDateString(v)),
    body("endTime").custom(v=> isDateString(v)),
    body("progress").custom(v=> {
        if(v) return !Number.isNaN(v)
        return true
    }),
    body("priority").custom(v=> {
        if(v){
            let list = TASKPRIORITIES;
            return list.includes(v)

        }
        return true;

    }),
    body("status").custom(v=> {
        if(v){
            let list = TASKSTATUSTYPES;
            return list.includes(v)

        }
        return true;

    }),
    body("additionalNotes").custom(v=> {
        if(v){
            return typeof v === 'string'
        }
        return true;

    })



]


module.exports.taskUpdateValidation = [
    body("taskid").isMongoId(),
    body("pcd").notEmpty().isString(),

    body("updatedData.projectCode").custom(v=> {
        if(v){
            return typeof v === 'string'
        }
        return true;

    }),
    body("updatedData.assignedMembers").custom(v=> {
        if(v){
           let isValid =  v.every(i=> isObjectIdOrHexString(i) )
           console.log("is undefined",isValid);
           return isValid
        }
        return true;
    }),
    body("startTime").custom(v=> {
        if(v){

            return isDateString(v)
        }
        return true
    
        }),
    body("endTime").custom(v=> {
        if(v){
            return isDateString(v)
        }
        return true
    }),
    body("updatedData.taskType").custom(v=> {
        if(v){
            let list = TASKCATEGORY;
            return list.includes(v)

        }
        return true;

    }),
  
    body("updatedData.priority").custom(v=> {
        if(v){
            let list = TASKPRIORITIES;
            return list.includes(v)

        }
        return true;

    }),
    body("updatedData.status").custom(v=> {
        if(v){
            console.log(v);
            let list = TASKSTATUSTYPES;
            return list.includes(v)

        }
        return true;

    }),
    body("updatedData.additionalNotes").custom(v=> {
        if(v){
            return typeof v === 'string'
        }
        return true;

    })



]

module.exports.filterTaskValidation = [
    // body("query.userId").custom(v=> {
    //     if(v.length > 0){
    //         return v.every(i=> mongoose.isObjectIdOrHexString(i));

    //     }
    // }),
    body("query.startTime").custom(v=> {
        if(v.length){
            return isDateString(v);
        }
        return true;
    }),
    body("query.endTime").custom(v=> {
        if(v.length){
            return isDateString(v);
        }
        return true;
    }),
    body("query.priority").custom(v=>{
        let list = TASKPRIORITIES
        if(v.length>0){
            return v.every(i=> list.includes(i))
        }
        return true;
    }),
    // body("query.taskType").custom(v=>{
    //     let list = ["feature", "bug", "test", "research", "meeting", "design", "others"]
    //     if(v.length>0){
    //         return v.every(i=> list.includes(i))
    //     }
    //     return true;
    // }),
    // body("sortBy"),
  

]
