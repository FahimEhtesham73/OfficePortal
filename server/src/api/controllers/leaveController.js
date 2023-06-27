const { default: mongoose, mongo } = require("mongoose");
const Project = require("../models/projectModel");
const Leave = require('../models/leaveRequestModel');
const LeaveBoard = require("../models/leaveModel")

const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const AppError = require("../util/AppError");


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
        const userId = req.query.userId
        const userRole = req.user.role.alias
        const currentMonth = new Date().getMonth() + 1;
        if (userRole === 'Team Lead') {
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            { 'approvedByLeader.tId': new mongoose.Types.ObjectId(userId) },
                            { 'userId': { $ne: new mongoose.Types.ObjectId(userId) } }
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
        if (userRole === 'Project Lead') {
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            { 'approvedBySuperVisor.sId': new mongoose.Types.ObjectId(userId) },
                            { 'userId': { $ne: new mongoose.Types.ObjectId(userId) } },
                            { 'isAllLeaderApproved': { $eq: true } }
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
                    $lookup: {
                        from: "users",
                        localField: "approvedByLeader.tId",
                        foreignField: "_id",
                        as: "approvedBy"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        leaveType: 1,
                        approvedBy: "$approvedBy.firstName",
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
                        approvedBy: 1
                    }
                }
            ])
            return res.status(200).send(findRequest)
        }
        if (userRole === 'Admin') {
            const findRequest = await Leave.aggregate([
                {
                    $match: {
                        $and: [
                            { 'isAllLeaderApproved': { $eq: true } },
                            { 'isAllSuperVisorApproved': { $eq: true } },
                            { 'userId': { $ne: new mongoose.Types.ObjectId(userId) } }
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
                    $lookup: {
                        from: "users",
                        localField: "approvedBySuperVisor.sId",
                        foreignField: "_id",
                        as: "approvedBySuperVisor"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "approvedByLeader.tId",
                        foreignField: "_id",
                        as: "approvedByLeader"
                    }
                },
                // Project the desired fields
                {
                    $project: {
                        isAdminApproved: 1,
                        isFullyApproved: 1,
                        user: "$user.firstName",
                        leaveType: 1,
                        startDate: 1,
                        endDate: 1,
                        leaveReason: 1,
                        totalDay: 1,
                        approvedBySuperVisor: '$approvedBySuperVisor.firstName',
                        approvedByLeader: "$approvedByLeader.firstName"
                    }
                },

            ])
            return res.status(200).send(findRequest)
        }

    } catch (e) {
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}


module.exports.createUserLeaveAmount = async (req, res, next) => {
    try {
        console.log(req.body);
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Invalid request" })
        const userId = req.body.userId;
        const leaveCategory = req.body.leaveCategory;
        const leaveAmount = parseInt(req.body.leaveAmount);

        const isAvliable = await LeaveBoard.findOne({ userId, leaveCategory }).lean();
        console.log("achen naki", isAvliable);
        if (isAvliable) {

            const data = await LeaveBoard.findOneAndUpdate({ userId, leaveCategory }, { $set: { userId, leaveAmount, leaveCategory } }).lean();
            return res.status(200).json({ "message": "success", "data": data })
        }

        const data = await new LeaveBoard({ userId, leaveAmount: leaveAmount, leaveCategory }).save();


        console.log(data);
        return res.status(200).json({ "message": "Success", data: data });

    } catch (err) {
        next(err)
    }
}
module.exports.getLeaveBoardAmount = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ "message": "unsuccess" })
        const data = await LeaveBoard.find({ userId }).lean();
        let obj = {};
        for (let d of data) {
            obj[d.leaveCategory] = d.leaveAmount
        }
        return res.status(200).json({ "message": "success", "data": obj })
    } catch (err) {
        next(err)
    }
}
module.exports.getAllLeave = async (req, res, next) => {
    try {
        const body = req.body;
        let limit = body.limit ? parseInt(body.limit) : 10;
        let skip = body.skip ? parseInt(body.skip) : 0;
        let args = {}

        // console.log(req.user);


        for (let query in body) {
            if (body['usersId'].length <= 0) {
                args['usersId'] = [new mongoose.Types.ObjectId(req.user._id)]

            }
            else if (query === "usersId" && body['usersId']?.length) {
                args['usersId'] = body.usersId.map(v => new mongoose.Types.ObjectId(v))
            }
            // else{
            //     args['usersId'] = [new mongoose.Types.ObjectId(req.user._id)]

            // }

        }

        console.log(args);
        let data = await Leave.aggregate([
            {
                $match: {
                    userId: { $in: args.usersId }
                }

            },
            {
                $skip: parseInt(limit * skip)
            },

            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'approvedByLeader.tId',
                    foreignField: '_id',
                    as: 'leaderDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'approvedBySuperVisor.sId',
                    foreignField: '_id',
                    as: 'supervisorDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'usersDetails'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "userId": 1,
                    "leaveType": 1,
                    "approvedByLeader": 1,
                    "approvedBySuperVisor": 1,
                    "isAdminApproved": 1,
                    "isFullyApproved": 1,
                    "isAllSuperVisorApproved": 1,
                    "startDate": 1,
                    "endDate": 1,
                    "leaveReason": 1,
                    "totalDay": 1,
                    "createdAt": 1,
                    "leaderDetails._id": 1,
                    "leaderDetails.email": 1,
                    "leaderDetails.firstName": 1,
                    "leaderDetails.imagePath": 1,
                    "supervisorDetails._id": 1,
                    "supervisorDetails.email": 1,
                    "supervisorDetails.firstName": 1,
                    "supervisorDetails.imagePath": 1,
                    "supervisorDetails.isApproved": "$approvedBySuperVisor.isApproved",

                    "usersDetails._id": 1,
                    "usersDetails.email": 1,
                    "usersDetails.firstName": 1,
                    "usersDetails.imagePath": 1,



                }

            },
            {
                $addFields: {
                    supervisorDetails: {
                        $map: {
                            input: "$supervisorDetails",
                            as: "supervisor",
                            in: {
                                $mergeObjects: [
                                    "$$supervisor",
                                    {
                                        isApproved: {
                                            $cond: [
                                                {
                                                    $in: ["$$supervisor._id", "$approvedBySuperVisor.sId"]
                                                },
                                                {
                                                    $arrayElemAt: [
                                                        "$approvedBySuperVisor.isApproved",
                                                        {
                                                            $indexOfArray: [
                                                                "$approvedBySuperVisor.sId",
                                                                "$$supervisor._id"
                                                            ]
                                                        }
                                                    ]
                                                },
                                                "Pending"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    leaderDetails: {
                        $map: {
                            input: "$leaderDetails",
                            as: "leader",
                            in: {
                                $mergeObjects: [
                                    "$$leader",
                                    {
                                        isApproved: {
                                            $cond: [
                                                {
                                                    $in: ["$$leader._id", "$approvedByLeader.tId"]
                                                },
                                                {
                                                    $arrayElemAt: [
                                                        "$approvedByLeader.isApproved",
                                                        {
                                                            $indexOfArray: [
                                                                "$approvedByLeader.tId",
                                                                "$$leader._id"
                                                            ]
                                                        }
                                                    ]
                                                },
                                                "Pending"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
            // {$unwind: "$leaderDetails.isApproved"},
        ])
        return res.status(200).json({ "message": "Succcess", "data": data });
    } catch (e) {
        console.log(e);
        next(e)
    }
}


module.exports.updateALeave = async (req, res, next) => {
    try {
        const _id = req.body._id;
        const userId = req.body.userId;

        console.log(req.body);

        const leaveDetails = await Leave.findOne({ _id, userId }).lean();
        if (!leaveDetails) return res.status(400).json({ "message": "Invalid leave" })

        if (leaveDetails.userId.toString() === req.user._id.toString() || req.user.role.name === 'admin') {
            const updateData = {
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                leaveType: req.body.leaveType,
                totalDay: req.body.totalDay,
                updatedBy: req.user._id,
                leaveReason: req.body.leaveReason
            }

            await Leave.findOneAndUpdate({ _id, userId }, {
                $set: {
                    ...updateData
                }
            })
            return res.status(200).json({ "message": "Success" })

        }

        return res.status(403).json({ "message": "Access denied" })



    } catch (err) {
        next(err)
    }
}


module.exports.deleteALeave = async (req, res, next) => {
    try {

        const leaveId = req.query.leaveId;
        if (!leaveId) return res.status(400).json({ "message": "Invalid request" })
        const leaveDetails = await Leave.findOne({ _id: leaveId }).lean();
        if (!leaveDetails) return res.status(400).json({ "message": "No data" })
        if ((req.user.role.name === 'admin' || req.user._id.toString() === leaveDetails.userId.toString())) {
            await Leave.findOneAndDelete({ _id: leaveId })
            return res.status(200).json({ "message": "Success" });
        }
        return res.status(403).json({ "message": "Access Denied" })
    } catch (err) {
        next(err)
    }
}

module.exports.leaveStatusChange = async (req, res, next) => {
    try {
        const leaveId = req.body.leaveId;
        const approverId = req.body.approverId || req.user._id;
        const role = req.user.role.name;
        const status = req.body.status;
        let matchQuery = {}
        // let maping = {
        //     teamlead: approvedByLeader,
        //     projectlead: approvedBySuperVisor

        // }

        let leaveDetails = await isLeaveAvailabe(leaveId, approverId, role);
        if(!leaveDetails.length) return res.status(400).json({"message": "Data not found"})
        leaveDetails = leaveDetails[0]
        if(role === "admin") {
            await Leave.findOneAndUpdate({_id: leaveId}, {$set: {
                apporovedAdminId: approverId,
                isAdminApproved: status,
                isFullyApproved: status === "Approved"?  true: false
            }})
            return res.status(200).json({"message": "success"})
        }
        
        
        if(role === 'projectlead'){
            console.log("hello");
            await Leave.findOneAndUpdate({_id: leaveId, "approvedBySuperVisor.sId": approverId}, {$set: {
                "approvedBySuperVisor.$.isApproved": status

            }})
        }
        if(role === "teamlead"){
            // console.log("team lead", leaveDetails);
          

            await Leave.findOneAndUpdate({_id: leaveId, "approvedByLeader.tId": approverId}, {$set: {
                "approvedByLeader.$.isApproved": status

            }})
            // console.log("l", l);



        }

        let allLeadtrueFlag = true;
        let allprojectLeadtrueFlag = true;


        let details = await Leave.findOne({_id: leaveId}).lean();

        for(let lead of details?.approvedByLeader){
            if(lead.isApproved !== "Approved"){
                allLeadtrueFlag = false
                break;
            }  
        }
        for(let lead of details?.approvedBySuperVisor){
            if(lead.isApproved !== "Approved"){
                allprojectLeadtrueFlag = false
                break;
            }  
        }

        
        console.log("lead", allLeadtrueFlag, "super", allprojectLeadtrueFlag);
        let updated = await Leave.findOneAndUpdate({_id: leaveId}, {$set: {isAllLeaderApproved: allLeadtrueFlag, isAllSuperVisorApproved: allprojectLeadtrueFlag}},{new: true})


        return res.status(200).json({"message": "Success","data": updated})

    } catch (err) {
        console.log(err);
        next(err)
    }
}



// helper 

const isLeaveAvailabe = async(leaveId, approverId, role) => {
    let matchQuery = {}
    if(role === "admin") {
        matchQuery=  {
          $match:{_id: new mongoose.Types.ObjectId(leaveId), isAllLeaderApproved: true, isAllSuperVisorApproved: true}
      }
    }
      if(role === 'teamlead'){
        matchQuery =  {
            $match: {
                $and: [
                    {_id: new mongoose.Types.ObjectId(leaveId)},
                    
                    {$or: [
                        {"approvedByLeader.tId": new mongoose.Types.ObjectId(approverId)}
                    ]}

                ]
            }
        }
      }
      if(role === 'projectlead'){
        matchQuery =  {
            $match: {
                $and: [
                    {_id: new mongoose.Types.ObjectId(leaveId)},
                    
                    {$or: [
                        {"approvedBySuperVisor.sId": new mongoose.Types.ObjectId(approverId)}
                    ]}

                ]
            }
        }
      }
    const details = await Leave.aggregate([
        matchQuery
    ])
    return details;
} 