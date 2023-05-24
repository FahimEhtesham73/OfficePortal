const { default: mongoose } = require("mongoose");
const Project = require("../models/projectModel");
const { updateAProject } = require("../services/projectServices");

/********** Project query stages ***********/

module.exports.createProject = async (req, res) => {
    try {

        const { projectName, projectSuperVisor, projectLead, projectStartTime, projectEndTime } = req.body;
        const isProjectAvailable = await Project.findOne({ projectName }).lean()
        if (isProjectAvailable) return res.status(400).json({ "message": `${projectName} project is already created` })
        const data = {
            projectName,
            projectSuperVisor,
            projectLead,
            projectStartTime,
            projectEndTime,
            createdBy: req.user._id,
        }
        // if (.includes(projectLead) || projectMembers.includes(projectLead)) {
        //     return res.status(400).json({ "message": "Team members already present in project supervisor or lead" })
        // }
        const project = await Project.create({ ...data });
        let projectSuperVisorLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectSuperVisor",
                foreignField: "_id",
                as: "projectSuperVisorDetails",
            }
        };
        let projectLeadLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectLead",
                foreignField: "_id",
                as: "projectLeadDetails",
            }
        };
        let projectMembersLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectMembers",
                foreignField: "_id",
                as: "projectMembersList",
            }
        };


        const projectStage = {
            $project: {
                _id: 1,
                projectName: 1,
                projectSuperVisor: 1,
                projectLead: 1,
                projectStartTime: 1,
                projectEndTime: 1,
                isCurrentlyActive: 1,
                projectMembers: 1,
                projectSuperVisorDetails: { _id: 1, firstName: 1, lastName: 1 },
                projectLeadDetails: { _id: 1, firstName: 1, lastName: 1 },
                projectMembersList: { _id: 1, firstName: 1, lastName: 1 }
            }
        }

        const newProject = await Project.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(project._id)
                }
            },
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
        ])
        
        return res.status(200).json({ "message": "Project created successfully", "data": newProject })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }
}

module.exports.updateProject = async (req, res) => {
    try {
        const projectId = req.body.pId;
        const project = await Project.findOne({ _id: projectId }).lean();
        if (!project) return res.status(404).json({ "message": "No project found" });
        const updatedData = req.body.updatedData;
        let args = { updatedBy: req.user._id };
        for (let arg in updatedData) {
            if (arg === "projectName") {
                args['projectName'] = updatedData['projectName']
            }
            if (arg === "projectLead") {
                args['projectLead'] = updatedData['projectLead']

            }
            if (arg === "projectSuperVisor") {
                args['projectSuperVisor'] = updatedData['projectSuperVisor']

            }
            if (arg === "newTeamMembers") {
                args['newTeamMembers'] = updatedData['newTeamMembers']

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

        let projectSuperVisorLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectSuperVisor",
                foreignField: "_id",
                as: "projectSuperVisorDetails",
            }
        };
        let projectLeadLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectLead",
                foreignField: "_id",
                as: "projectLeadDetails",
            }
        };
        let projectMembersLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectMembers",
                foreignField: "_id",
                as: "projectMembersList",
            }
        };


        const projectStage = {
            $project: {
                _id: 1,
                projectName: 1,
                projectSuperVisor: 1,
                projectLead: 1,
                projectStartTime: 1,
                projectEndTime: 1,
                isCurrentlyActive: 1,
                projectMembers: 1,
                projectSuperVisorDetails: { _id: 1, firstName: 1, lastName: 1 },
                projectLeadDetails: { _id: 1, firstName: 1, lastName: 1 },
                projectMembersList: { _id: 1, firstName: 1, lastName: 1 }
            }
        }
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

        if(!mongoose.isObjectIdOrHexString(projectId)) return res.status(400).json({"error": "invalid project id"})
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
        let projectSuperVisorLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectSuperVisor",
                foreignField: "_id",
                as: "projectSuperVisorDetails",
            }
        };
        let projectLeadLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectLead",
                foreignField: "_id",
                as: "projectLeadDetails",
            }
        };
        let projectMembersLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectMembers",
                foreignField: "_id",
                as: "projectMembersList",
            }
        };
        const projectStage = {
            $project: {
                _id: 1,
                projectName: 1,
                projectSuperVisor: 1,
                projectLead: 1,
                projectStartTime: 1,
                projectEndTime: 1,
                isCurrentlyActive: 1,
                projectMembers: 1,
                projectSuperVisorDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
                projectLeadDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
                projectMembersList: { _id: 1, firstName: 1, lastName: 1, imagePath: 1  }
            }
        }
        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if(req.user.role.alias === "Admin"){
         const projects = await Project.aggregate([
            {$match: {
                _id: new mongoose.Types.ObjectId(projectId)
            }},
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
         ]);
         if(!projects.length) return res.status(400).json({"message": "Project not found"})

         return res.status(200).json({"message": "successfull", data: projects});
        }
        const projects = await Project.aggregate([
            matchStage,
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
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
        let projectSuperVisorLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectSuperVisor",
                foreignField: "_id",
                as: "projectSuperVisorDetails",
            }
        };
        let projectLeadLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectLead",
                foreignField: "_id",
                as: "projectLeadDetails",
            }
        };
        let projectMembersLookupSatge = {
            $lookup: {
                from: "users",
                localField: "projectMembers",
                foreignField: "_id",
                as: "projectMembersList",
            }
        };
        const projectStage = {
            $project: {
                _id: 1,
                projectName: 1,
                projectSuperVisor: 1,
                projectLead: 1,
                projectStartTime: 1,
                projectEndTime: 1,
                isCurrentlyActive: 1,
                projectMembers: 1,
                projectSuperVisorDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
                projectLeadDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
                projectMembersList: { _id: 1, firstName: 1, lastName: 1, imagePath: 1  }
            }
        }
        // const projects = await Project.find({$or: [{projectLead: {$eq: req.user._id}}, {projectSuperVisor: {$eq: req.user._id}}, {projectMembers: req.user._id} ]}).populate("firstName users").lean();
        if(req.user.role.alias === "Admin"){
         const projects = await Project.aggregate([
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
            projectMembersLookupSatge,

            projectStage,
         ]);

         return res.status(200).json({"message": "successfull", data: projects});
        }
        const projects = await Project.aggregate([
            matchStage,
            projectSuperVisorLookupSatge,
            { $unwind: "$projectSuperVisorDetails" },

            projectLeadLookupSatge,
            { $unwind: "$projectLeadDetails" },
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