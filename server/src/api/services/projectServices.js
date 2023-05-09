const Project = require("../models/projectModel");

module.exports.updateAProject = async (data, pid) => {

    if(data?.newTeamMembers?.length){
       return await Project.findByIdAndUpdate({_id: pid}, {$set: {
            ...data,
        }, $addToSet: {"projectMembers": {$each: data.newTeamMembers }}}).lean()
    }
    return await Project.findByIdAndUpdate({_id: pid}, {$set: {
        ...data,
    }
    }).lean()
}

