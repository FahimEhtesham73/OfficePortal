const {check, body, query, param} = require("express-validator")
const { default: mongoose } = require("mongoose")
const {isDateString} = require("../validator/commonValidation")
const { AttendeceTypes } = require("../commonValues");



module.exports.createVideoKnowledgeValidator = [
    // body("author").custom(v=> {
    //     const key = ["name", "oId"];
    //     if(Object.keys(v).length === 2 &&  typeof v[key[0]] === "string" && typeof v[key[1]] === "string") {
    //         return true
    //     }
    //     return false
    // }),
    body("title").notEmpty().isString(),
    body("knowledgeType").notEmpty().isString(),
    body("categories").custom(v=> {
        if(Array.isArray(v)){
            for(let i of v){
                const key = ["name", "oId"];
                if(Object.keys(i).length === 2 &&  typeof i[key[0]] === "string" && typeof i[key[1]] === "string") {
                    return true
                }
            }
        }
        return false
    }),
    body("knowledgeCategory").notEmpty().isString(),
    body("filePath").custom(v=>  {
        if(v) {
            return typeof v === "string"
        }
        return true
    }),
    body("thumbnailpath").custom(v=>  {
        if(v) {
            return typeof v === "string"
        }
        return true
    }),
    body("knowledgeCategory").custom(v=>  {
        if(v) {
            return typeof v === "string"
        }
        return true
    }),

    



]


module.exports.getSingleKnowledgeValidator = [
    param("knowledgeShareId").notEmpty().isString()
]

module.exports.updateSingleKnowledgeValidator = [
        body("author").custom(v=> {
            if(v){
                const key = ["name", "oId"];
                if(Object.keys(v).length === 2 &&  typeof v[key[0]] === "string" && typeof v[key[1]] === "string") {
                    return true
                }
                return false

            }
            return true
        }),
        body("categories").custom(v=> {
            if(v){

                if(Array.isArray(v)){
                    for(let i of v){
                        const key = ["name", "oId"];
                        if(Object.keys(i).length === 2 &&  typeof i[key[0]] === "string" && typeof i[key[1]] === "string") {
                            return true
                        }
                    }
                }
                return false
            }
            return true
        }),
        body("filePath").custom(v=>  {
            if(v) {
                return typeof v === "string"
            }
            return true
        }),
        body("thumbnailpath").custom(v=>  {
            if(v) {
                return typeof v === "string"
            }
            return true
        }),
        body("knowledgeCategory").custom(v=>  {
            if(v) {
                return typeof v === "string"
            }
            return true
        }),
    
]

