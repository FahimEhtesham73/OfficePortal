module.exports.projectSuperVisorLookupSatge = {
    $lookup: {
        from: "users",
        localField: "projectSuperVisor",
        foreignField: "_id",
        as: "projectSuperVisorDetails",
    }
};
module.exports.projectLeadLookupSatge = {
    $lookup: {
        from: "users",
        localField: "projectLead",
        foreignField: "_id",
        as: "projectLeadDetails",
    }
};
module.exports.projectMembersLookupSatge = {
    $lookup: {
        from: "users",
        localField: "projectMembers",
        foreignField: "_id",
        as: "projectMembersList",
    }
};
module.exports.projectStage = {
    $project: {
        _id: 1,
        projectOwner: 1,
        projectDescription: 1,
        superVisorTime: 1,
        leadTime: 1,
        memberTime: 1,
        projectName: 1,
        projectSuperVisor: 1,
        projectLead: 1,
        projectStartTime: 1,
        projectEndTime: 1,
        isCurrentlyActive: 1,
        projectMembers: 1,
        projectCode: 1,
        projectSuperVisorDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
        projectLeadDetails: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 },
        projectMembersList: { _id: 1, firstName: 1, lastName: 1, imagePath: 1 }
    }
}

module.exports.lookupSubProjects = {
    $lookup: {
        from: 'subprojects', 
        localField: 'projectCode',
        foreignField: 'projectId',
        as: 'subProjects'
    }
};