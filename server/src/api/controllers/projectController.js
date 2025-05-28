const { default: mongoose } = require("mongoose");
const Project = require("../models/projectModel");
const { updateAProject } = require("../services/projectServices");
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


module.exports.createProject = async (req, res) => {
    try {
        // console.log("Hitted");
        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })

        const { projectName, projectSuperVisor, projectLead, projectMembers, projectStartTime, projectEndTime,
             projectOwner, superVisorTime, leadTime, memberTime, projectDescription, projectCode } = req.body;

        // console.log(" create project req body",req.body);

        if (!checkObjectValues(req.body)) return res.status(400).json({ message: "Fill all the mandatory fields" })

        const isProjectAvailable = await Project.findOne({ $or: [{projectName: projectName}, {projectCode: projectCode}]}).lean()
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

        const project = await Project.create({ ...data });

        const subProject = await SubProject.create({...data, projectId:projectCode})

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
            if (arg === "projectCode") {
                args['projectCode'] = updatedData['projectCode']
            }
        }
        
        const isProjectAvialbelInSameNameOrCode = await Project.aggregate([
            {$match: {
                $or: [{projectName: args.projectName}, {projectCode: args.projectCode}],
                _id: {$ne: new mongoose.Types.ObjectId(projectId)}
            }}
        ]) 
        if(isProjectAvialbelInSameNameOrCode.length > 0) return res.status(400).json({"message": "Project code or name already avialable"})      
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

        const projectCode = req.params.id;

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
            const projects = await Project.aggregate([
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
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const matchStage = {
            $match: {
                $or: [
                    { projectLead: new mongoose.Types.ObjectId(req.user._id) },
                    { projectMembers: new mongoose.Types.ObjectId(req.user._id) },
                    { projectSuperVisor: new mongoose.Types.ObjectId(req.user._id) },
                ]
            }
        }

        const lookupSubProjects = {
            $lookup: {
                from: 'subprojects',  // Ensure this matches the actual collection name
                localField: 'projectCode',
                foreignField: 'projectId',
                as: 'subProjects'
            }
        };

        const matchUserInSubProjects = {
            $match: {
                $or: [
                    { 'subProjects.projectLead': userId },
                    { 'subProjects.projectMembers': userId },
                    { 'subProjects.projectSuperVisor': userId }
                ]
            }
        };
  
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
            // lookupSubProjects,
            // matchUserInSubProjects,
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
    const { projectId, projectCode } = req.body;
    const project = await Project.findOne({_id: projectId});
    if (!project) return res.status(400).json("project not found");
    await Project.findOneAndDelete({_id: projectId});
    await SubProject.deleteMany({projectId: projectCode})
    await ProjectContribution.deleteMany({projectCode})
    return res.status(200).json("successfully deleted");
}

module.exports.getProjectUsers = async (req, res) => {
    try{
        const projectCode = req.body.projectCode;
        if(!projectCode) return res.status(400).json({"message": "Invalid request"})

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

        const totalUser = [...projectUser.superVisorDetails, ...projectUser.projectLeadDetails, ...projectUser.membersDetails ]

        return res.status(200).json({"message": "success", "data": totalUser});
        
    }catch(e){

    }
}