const Project = require("../models/projectModel");

module.exports.updateAProject = async (data, pid) => {
    // console.log("show updated data and project id",pid,data);
    return await Project.findByIdAndUpdate({_id: pid}, {$set: {
        ...data,
    }
    }).lean()
}

