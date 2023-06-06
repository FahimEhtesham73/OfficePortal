const { default: mongoose } = require("mongoose");
const Project = require("../models/projectModel");
const Leave = require('../models/leaveRequestModel')

const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");


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


module.exports.createLeave = async (req, res) => {
    try {
        const userRole = req.user.role.alias
        console.log("user role from cookie", userRole);
        const { userId, leaveType, startDate, endDate, totalDay, leaveReason } = req.body

        let groupStage
        let matchStage
        if (userRole === 'Employee') {
            matchStage = {
                $match: {
                    projectMembers: new mongoose.Types.ObjectId(userId)
                },
            }
            groupStage = {
                $group: {
                    _id: null,
                    mergedTeamLeaders: { $push: '$projectLead' },
                    mergedSuperVisor: { $push: '$projectSuperVisor' }
                }
            }
        }
        else if (userRole === 'Team Lead') {

            matchStage = {
                $match: {
                    projectLead: new mongoose.Types.ObjectId(userId)
                },
            }

            groupStage = {
                $group: {
                    _id: null,
                    mergedSuperVisor: { $push: '$projectSuperVisor' }
                }
            }
        }

        findTeamLeader = await Project.aggregate([
            matchStage,
            groupStage
        ])

        const tempArrLeader = userRole === 'Employee' && findTeamLeader[0]?.mergedTeamLeaders?.flat() || []
        const tempArrSv = findTeamLeader[0]?.mergedSuperVisor?.flat() || []

        if (userRole === 'Employee' && tempArrLeader.length === 0 || tempArrSv.length === 0) {
            return res.status(400).json({ message: "you are not assigned any team leader or supervisor" })
        }

        // converting the object id into string to check duplicate value
        const stringLeaderArray = userRole === 'Employee' && tempArrLeader.map(objectId => objectId.toString());
        const stringSvArray = tempArrSv.map(objectId => objectId.toString());

        const mergedLeaderArr = userRole === 'Employee' && [...new Set(stringLeaderArray)]
        const mergedSvArr = [...new Set(stringSvArray)]

        // making unique array to database model format
        const formattedLeaderArr = userRole === 'Employee' ? mergedLeaderArr.map(val => { return { tId: val } }) : [{ tId: userId, isApproved: "Approved" }]
        const formattedSvArray = mergedSvArr.map(val => { return { sId: val } })

        const data = {
            userId,
            leaveType,
            startDate,
            endDate,
            totalDay,
            leaveReason,
            approvedByLeader: formattedLeaderArr,
            approvedBySuperVisor: formattedSvArray
        }

        const leave = await Leave.create({ ...data });

        // console.log(" merged leader array",mergedLeaderArr,"merged SV Arr:",mergedSvArr);

        return res.status(200).send(leave)

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }

}

module.exports.createLeaveSv = async (req, res) => {
    try {
        const userRole = req.user.role.alias
        console.log("user role from cookie", userRole);
        const { userId, leaveType, startDate, endDate, totalDay, leaveReason } = req.body


        const formattedSvArray = userRole === 'Project Lead' ? [{ sId: userId, isApproved: "Approved" }] : []

        const data = {
            userId,
            leaveType,
            startDate,
            endDate,
            totalDay,
            leaveReason,
            approvedByLeader: [],
            isAllLeaderApproved: true,
            isAllSuperVisorApproved: true,
            approvedBySuperVisor: formattedSvArray
        }

        const leave = await Leave.create({ ...data });

        // console.log(" merged leader array",mergedLeaderArr,"merged SV Arr:",mergedSvArr);

        return res.status(200).send(leave)

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" })

    }

}

module.exports.getLeaveStatus = async (req, res) => {
    try {
        const userId = req.params.userId
        const userRole = req.user.role.alias
        const currentMonth = new Date().getMonth() + 1;
        if (userRole === 'Team Lead') {
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            { 'approvedByLeader.tId': new mongoose.Types.ObjectId(userId) },
                            {'userId':{$ne:new mongoose.Types.ObjectId(userId)}}
                        ]

                    }
                },
                {
                    $addFields: {
                        month: { $month: "$createdAt" } 
                    }
                },
                {
                    $match: {
                        month: currentMonth
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        leaveType: 1,
                        isApproved: {
                            $filter: {
                                input: "$approvedByLeader",
                                as: "leader",
                                cond: { $eq: ["$$leader.tId", new mongoose.Types.ObjectId(userId)] }
                              }
                        },
                        isAllLeaderApproved: 1,
                        isAdminApproved: 1,
                        isAllSuperVisorApproved: 1,
                        startDate: 1,
                        endDate: 1,
                        isFullyApproved: 1,
                        leaveReason: 1,
                        totalDay: 1,
                        createdBy: 1,
                        updatedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                // Populate the userId field
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                // Project the desired fields
                {
                    $project: {
                        user: "$user.firstName",
                        leaveType: 1,
                        isApproved: '$isApproved.isApproved',
                        startDate: 1,
                        endDate: 1,
                        leaveReason: 1,
                        totalDay: 1,
                    }
                }
            ])
            return res.status(200).send(findRequest)
        }
        if(userRole === 'Project Lead'){
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            { 'approvedBySuperVisor.sId': new mongoose.Types.ObjectId(userId)},
                            {'userId':{$ne:new mongoose.Types.ObjectId(userId)}},
                            {'isAllLeaderApproved':{$eq:true}}
                        ]

                    }
                },
                {
                    $addFields: {
                        month: { $month: "$createdAt" }
                    }
                },
                {
                    $match: {
                        month: currentMonth
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField: "approvedByLeader.tId",
                        foreignField: "_id",
                        as:"approvedBy"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        leaveType: 1,
                        approvedBy:"$approvedBy.firstName",
                        isApproved: {
                            $filter: {
                                input: "$approvedBySuperVisor",
                                as: "superVisor",
                                cond: { $eq: ["$$superVisor.sId", new mongoose.Types.ObjectId(userId)] }
                              }
                        },
                        isAllLeaderApproved: 1,
                        isAdminApproved: 1,
                        isAllSuperVisorApproved: 1,
                        startDate: 1,
                        endDate: 1,
                        isFullyApproved: 1,
                        leaveReason: 1,
                        totalDay: 1,
                        createdBy: 1,
                        updatedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                // Populate the userId field
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                // Project the desired fields
                {
                    $project: {
                        user: "$user.firstName",
                        leaveType: 1,
                        isApproved: '$isApproved.isApproved',
                        startDate: 1,
                        endDate: 1,
                        leaveReason: 1,
                        totalDay: 1,
                        approvedBy:1
                    }
                }
            ])
            return res.status(200).send(findRequest)
        }
        if(userRole === 'Admin'){
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            {'isAllLeaderApproved':{$eq:true}},
                            {'isAllSuperVisorApproved':{$eq:true}},
                            {'userId':{$ne:new mongoose.Types.ObjectId(userId)}}
                        ]

                    }
                },
                {
                    $addFields: {
                        month: { $month: "$createdAt" } 
                    }
                },
                {
                    $match: {
                        month: currentMonth
                    }
                },

                // Populate the userId field
                {
                    $lookup: {
                        from: "users", 
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $lookup:{
                        from:"users",
                        localField: "approvedBySuperVisor.sId",
                        foreignField: "_id",
                        as:"approvedBySuperVisor"
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField: "approvedByLeader.tId",
                        foreignField: "_id",
                        as:"approvedByLeader"
                    }
                },
                // Project the desired fields
                {
                    $project: {
                        user: "$user.firstName",
                        leaveType: 1,
                        startDate: 1,
                        endDate: 1,
                        leaveReason: 1,
                        totalDay: 1,
                        approvedBySuperVisor:'$approvedBySuperVisor.firstName',
                        approvedByLeader:"$approvedByLeader.firstName"
                    }
                },
                
            ])
            return res.status(200).send(findRequest)
        }

    } catch (e) {
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}