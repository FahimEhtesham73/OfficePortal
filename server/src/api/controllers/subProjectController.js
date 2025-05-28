const { default: mongoose } = require("mongoose");
const Project = require("../models/projectModel");
const { updateASubProject, updateAProjectByCode } = require("../services/projectServices");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { projectSuperVisorLookupSatge, projectLeadLookupSatge, projectMembersLookupSatge, projectStage } = require("../util/projectCommonTemplate");
const SubProject = require("../models/subProjectModel");
const ProjectContribution = require("../models/contributionModel");


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


module.exports.createSubProject = async (req, res) => {
    try {
        const erros = validationMessages(validationResult(req).mapped());
        console.log({erros});
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })

        const { projectName, projectSuperVisor, projectLead, projectMembers, projectStartTime, projectEndTime,
            projectOwner, superVisorTime, leadTime, memberTime, projectDescription, projectCode } = req.body;
        const projectId = req.params.id

        if (!checkObjectValues(req.body)) return res.status(400).json({ message: "Fill all the mandatory fields" })

        const isProjectAvailable = await SubProject.findOne({ $or: [{$and:[{ projectName: projectName }]}, { projectCode: projectCode }] }).lean()
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
            projectCode,
            createdBy: req.user._id
        }

        const subProject = await SubProject.create({ ...data, projectId: projectId })

        const newProject = await SubProject.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(subProject._id)
                }
            },

            projectSuperVisorLookupSatge,
            // { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            // { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])

        return res.status(200).json({ "message": " Sub Project created successfully", "data": newProject })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }

}

module.exports.getAllSubProject = async (req, res) => {
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
        // console.log({matchStage});

        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if (req.user.role.alias === "Admin") {
            const projects = await SubProject.aggregate([
                {
                    $match: {
                        projectId: req.params.id
                    }
                },
                projectSuperVisorLookupSatge,
                // { $unwind: "$projectSuperVisorDetails" },

                projectLeadLookupSatge,
                // { $unwind: "$projectLeadDetails" },
                projectMembersLookupSatge,

                projectStage,
            ]);

            return res.status(200).json({ "message": "successfull", data: projects });
        }

        const projects = await SubProject.aggregate([
            {
                $match: {
                    projectId: req.params.id
                }
            },
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

module.exports.deleteSingleSubProject = async (req, res) => {
    const { projectId, subProjectCode } = req.body;
    // console.log({projectId});
    const project = await SubProject.findOne({ _id: projectId });
    console.log({ project });
    if (!project) return res.status(400).json("project not found");
    await SubProject.findOneAndDelete({ _id: projectId });
    await ProjectContribution.deleteMany({subProjectCode})
    return res.status(200).json("successfully deleted");
}

module.exports.getASubPoroject = async (req, res) => {
    try {

        const projectCode = req.params.subid;
        console.log({ projectCode });
        // if (!mongoose.isObjectIdOrHexString(projectId)) return res.status(400).json({ "error": "invalid project id" })
        const matchStage = {
            $match: {
                projectCode: projectCode,
                $or: [
                    { projectLead: new mongoose.Types.ObjectId(req.user._id) },
                    { projectMembers: new mongoose.Types.ObjectId(req.user._id) },
                    { projectSuperVisor: new mongoose.Types.ObjectId(req.user._id) },
                ]
            }
        }

        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if (req.user.role.alias === "Admin") {
            const projects = await SubProject.aggregate([
                {
                    $match: {
                        projectCode: projectCode
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
        const projects = await SubProject.aggregate([
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

module.exports.updateSubProject = async (req, res) => {
    try {
        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })

        const projectId = req.body.pId;
        const rootProjectId = req.params.id;
        const project = await SubProject.findOne({ _id: projectId }).lean();
        if (!project) return res.status(404).json({ "message": "No project found" });
        const updatedData = req.body;
        console.log({updatedData});
        let args = { updatedBy: req.user._id };
        let argsForProject = { updatedBy: req.user._id };

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
                argsForProject['projectLead'] = updatedData['projectLead']
            }
            if (arg === "projectSuperVisor") {
                args['projectSuperVisor'] = updatedData['projectSuperVisor']
                argsForProject['projectSuperVisor'] = updatedData['projectSuperVisor']
            }
            if (arg === "projectMembers") {
                args['projectMembers'] = updatedData['projectMembers']
                argsForProject['projectMembers'] = updatedData['projectMembers']
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
            if (arg === "projectCode") {
                args['projectCode'] = updatedData['projectCode']
            }
        }

        const isProjectAvialbelInSameNameOrCode = await SubProject.aggregate([
            {
                $match: {
                    $or: [{ projectName: args.projectName }, { projectCode: args.projectCode }],
                    _id: { $ne: new mongoose.Types.ObjectId(projectId) }
                }
            }
        ])
        if (isProjectAvialbelInSameNameOrCode.length > 0) return res.status(400).json({ "message": "Project code or name already available" })
        const updatedResult = await updateASubProject(args, projectId);
        await updateAProjectByCode(args, rootProjectId)

        let newUpadatedData = await SubProject.aggregate([
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

module.exports.getProjectUsers = async (req, res) => {
    try {
        const projectCode = req.body.projectCode;
        if (!projectCode) return res.status(400).json({ "message": "Invalid request" })

        const projectUser = await Project.aggregate([

            {
                '$match': {
                    'projectCode': projectCode
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'projectSuperVisor',
                    'foreignField': '_id',
                    'as': 'superVisorDetails'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'projectLead',
                    'foreignField': '_id',
                    'as': 'projectLeadDetails'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'projectMembers',
                    'foreignField': '_id',
                    'as': 'membersDetails'
                }
            }, {
                '$project': {
                    'superVisorDetails._id': 1,
                    'superVisorDetails.firstName': 1,
                    'superVisorDetails.lastName': 1,
                    'superVisorDetails.email': 1,
                    'superVisorDetails.imagePath': 1,
                    'projectLeadDetails._id': 1,
                    'projectLeadDetails.firstName': 1,
                    'projectLeadDetails.lastName': 1,
                    'projectLeadDetails.email': 1,
                    'projectLeadDetails.imagePath': 1,
                    'membersDetails._id': 1,
                    'membersDetails.firstName': 1,
                    'membersDetails.lastName': 1,
                    'membersDetails.email': 1,
                    'membersDetails.imagePath': 1
                }
            }


        ]);

        const totalUser = [...projectUser.superVisorDetails, ...projectUser.projectLeadDetails, ...projectUser.membersDetails]

        return res.status(200).json({ "message": "success", "data": totalUser });

    } catch (e) {

    }
}

module.exports.searchProject = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const subProjects = await SubProject.find({ $or: [{ projectMembers: userId },] }, 'projectId projectCode isCurrentlyActive').populate('projectMembers', 'projectName');

        if (subProjects.length === 0) {
            return res.status(404).json({ message: "No subprojects found for this user" });
        }


        const projectsInfo = subProjects.map((subProject) => ({
            projectCode: subProject.projectId,
            subProjectCode: subProject.projectCode,
            mergedProjectCode: `${subProject.projectId}-${subProject.projectCode}`,
            currentlyActive: subProject.isCurrentlyActive
        }));

        return res.status(200).json({ message: "Success", data: projectsInfo });
    } catch (error) {
        console.error("Error searching subprojects:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


