const { default: mongoose } = require("mongoose");
const Project = require("../models/projectModel");
const { updateAProject } = require("../services/projectServices");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { projectSuperVisorLookupSatge, projectLeadLookupSatge, projectMembersLookupSatge, projectStage } = require("../util/projectCommonTemplate");

/********** Project query stages ***********/

// Check if req.body object has all value
function checkObjectValues(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value === '' || value === null) {
                return false;
            }
        }
    }
    return true;
}


module.exports.createProject = async (req, res) => {
    try {
        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })

        const { projectName, projectSuperVisor, projectLead, projectMembers, projectStartTime, projectEndTime, projectOwner, superVisorTime, leadTime, memberTime, projectDescription } = req.body;

        // console.log(" create project req body",req.body);

        if (!checkObjectValues(req.body)) return res.status(400).json({ message: "Fill all the mandatory fields" })

        const isProjectAvailable = await Project.findOne({ projectName }).lean()
        if (isProjectAvailable) return res.status(400).json({ "message": `${projectName} project is already created` })

        const data = {
            projectDescription,
            projectName,
            projectSuperVisor,
            projectLead,
            projectMembers,
            projectOwner,
            superVisorTime,
            leadTime,
            memberTime,
            projectStartTime,
            projectEndTime,
            createdBy: req.user._id
        }

        const project = await Project.create({ ...data });

       

        const newProject = await Project.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(project._id)
                }
            },

            projectSuperVisorLookupSatge,
            // { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            // { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])

        return res.status(200).json({ "message": "Project created successfully", "data": newProject })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }

}

module.exports.updateProject = async (req, res) => {
    try {
        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })

        const projectId = req.body.pId;
        const project = await Project.findOne({ _id: projectId }).lean();
        if (!project) return res.status(404).json({ "message": "No project found" });
        const updatedData = req.body;
        let args = { updatedBy: req.user._id };

        for (let arg in updatedData) {
            if (arg === "projectDescription") {
                args['projectDescription'] = updatedData['projectDescription']
            }
            if (arg === "projectOwner") {
                args['projectOwner'] = updatedData['projectOwner']
            }
            if (arg === "projectName") {
                args['projectName'] = updatedData['projectName']
            }
            if (arg === "projectLead") {
                args['projectLead'] = updatedData['projectLead']
            }
            if (arg === "projectSuperVisor") {
                args['projectSuperVisor'] = updatedData['projectSuperVisor']
            }
            if (arg === "projectMembers") {
                args['projectMembers'] = updatedData['projectMembers']
            }
            if (arg === "superVisorTime") {
                args['superVisorTime'] = updatedData['superVisorTime']
            }
            if (arg === "leadTime") {
                args['leadTime'] = updatedData['leadTime']
            }
            if (arg === "memberTime") {
                args['memberTime'] = updatedData['memberTime']
            }

            if (arg === "projectStartTime") {
                args['projectStartTime'] = updatedData['projectStartTime']
            }
            if (arg === "projectEndTime") {
                args['projectEndTime'] = updatedData['projectEndTime']
            }
            if (arg === "isCurrentlyActive") {
                args['isCurrentlyActive'] = updatedData['isCurrentlyActive']
            }
        }

        const updatedResult = await updateAProject(args, projectId);

       
        let newUpadatedData = await Project.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(updatedResult._id)
                }
            },
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])
        return res.status(200).json({ "message": "Update successfully", "data": newUpadatedData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}

module.exports.getAPoroject = async (req, res) => {
    try {

        const projectId = req.params.id;

        if (!mongoose.isObjectIdOrHexString(projectId)) return res.status(400).json({ "error": "invalid project id" })
        const matchStage = {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId),
                $or: [
                    { projectLead: new mongoose.Types.ObjectId(req.user._id) },
                    { projectMembers: new mongoose.Types.ObjectId(req.user._id) },
                    { projectSuperVisor: new mongoose.Types.ObjectId(req.user._id) },
                ]
            }
        }
       
        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if (req.user.role.alias === "Admin") {
            const projects = await Project.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(projectId)
                    }
                },
                projectSuperVisorLookupSatge,
                // { $unwind: "$projectSuperVisorDetails" },

                projectLeadLookupSatge,
                // { $unwind: "$projectLeadDetails" },
                projectMembersLookupSatge,

                projectStage,
            ]);
            if (!projects.length) return res.status(400).json({ "message": "Project not found" })

            return res.status(200).json({ "message": "successfull", data: projects });
        }
        const projects = await Project.aggregate([
            matchStage,
            projectSuperVisorLookupSatge,
            // { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            // { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])

        if (!projects.length) return res.status(400).json({ "message": "No project found" });
        return res.status(200).json({ "data": projects })
    } catch (err) {
        console.log("err", err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }
}

module.exports.getAllPoroject = async (req, res) => {
    try {


        const args = {};
        const matchStage = {
            $match: {
                $or: [
                    { projectLead: new mongoose.Types.ObjectId(req.user._id) },
                    { projectMembers: new mongoose.Types.ObjectId(req.user._id) },
                    { projectSuperVisor: new mongoose.Types.ObjectId(req.user._id) },
                ]
            }
        }
  
        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if (req.user.role.alias === "Admin") {
            const projects = await Project.aggregate([
                projectSuperVisorLookupSatge,
                // { $unwind: "$projectSuperVisorDetails" },

                projectLeadLookupSatge,
                // { $unwind: "$projectLeadDetails" },
                projectMembersLookupSatge,

                projectStage,
            ]);

            return res.status(200).json({ "message": "successfull", data: projects });
        }

        const projects = await Project.aggregate([
            matchStage,
            projectSuperVisorLookupSatge,
            // { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            // { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])

        if (!projects.length) return res.status(400).json({ "message": "No project found" });
        return res.status(200).json({ "data": projects })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }
}

module.exports.deleteSingleProject = async (req, res) => {
    const { projectId } = req.body;
    const project = await Project.findOne({_id: projectId});
    if (!project) return res.status(400).json("project not found");
    await Project.findOneAndDelete(projectId);
    return res.status(200).json("successfully deleted");

}