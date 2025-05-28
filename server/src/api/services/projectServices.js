const Project = require("../models/projectModel");
const subProjectModel = require("../models/subProjectModel");

module.exports.updateAProject = async (data, pid) => {
    // console.log("show updated data and project id",pid,data);
    return await Project.findByIdAndUpdate({_id: pid}, {$set: {
        ...data,
    }
    }).lean()
}

module.exports.updateASubProject = async (data, pid) => {
    // console.log("show updated data and project id",pid,data);
    return await subProjectModel.findByIdAndUpdate({_id: pid}, {$set: {
        ...data,
    }
    }).lean()
}

module.exports.updateAProjectByCode = async (data, pid) => {
    // console.log("show updated data and project id",pid,data);
    return await Project.findOneAndUpdate({projectCode: pid}, {$set: {
        ...data,
    }
    }).lean()
}

