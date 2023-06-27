const {body, check} = require("express-validator");
const { isObjectIdOrHexString } = require("mongoose")

module.exports.taskCreationValidation = [
    body("taskName").notEmpty().isString(),
    body("projectCode").notEmpty().isString(),
    body("projectCode").custom(v=> {
        if(v){
            return typeof v === 'string'
        }
        return true;

    }),
    body("assignedMembers").custom(v=> {
        if(v){
           let isValid =  v.every(i=> isObjectIdOrHexString(i) )
           console.log("is undefined",isValid);
           return isValid
        }
        return true;
    }),
    // body("startTime").isDate({strictMode: false}),
    // body("endTime").isDate({strictMode: false}),
    body("progress").custom(v=> {
        if(v) return !Number.isNaN(v)
        return true
    }),
    body("priority").custom(v=> {
        if(v){
            let list = ["high", "medium", "low"];
            return list.includes(v)

        }
        return true;

    }),
    body("status").custom(v=> {
        if(v){
            let list = ["open", "doing", "done", "pause"];
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
    // body("startTime").isDate({strictMode: false}),
    // body("endTime").isDate({strictMode: false}),
    body("updatedData.taskType").custom(v=> {
        if(v){
            let list = ["feature", "bug", "test", "reasearch", "meeting", "design", "others"];
            return list.includes(v)

        }
        return true;

    }),
    body("updatedData.progress").custom(v=> {
        if(v) return !Number.isNaN(v)
        return true
    }),
    body("updatedData.priority").custom(v=> {
        if(v){
            let list = ["high", "medium", "low"];
            return list.includes(v)

        }
        return true;

    }),
    body("updatedData.status").custom(v=> {
        if(v){
            console.log(v);
            let list = ["open", "doing", "done", "pause"];
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


