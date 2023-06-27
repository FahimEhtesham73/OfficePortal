module.exports.taskLookupStage = {
    $lookup: {
        from: "users",
        localField: "assignedMembers",
        foreignField: "_id",
        as: "assignedMembersData"
    }
}

module.exports.taskProjectStage = {
    $project: {
        "_id": 1,
        "taskName": 1,
        "projectCode": 1,
        "projectId": 1,
        "assignedMembers": 1,
        "startTime": 1,
        "endTime": 1,
        "status": 1,
        "totalHour": 1,
        "priority": 1,
        "taskType": 1,
        "additionalNotes": 1,
        "createdBy": 1,
        "assignedMembersData._id": 1,
        "assignedMembersData.firstName": 1,
        "assignedMembersData.lastName": 1,
        "assignedMembersData.email": 1,
        "assignedMembersData.imagePath": 1,

    }
}