const { default: mongoose, mongo } = require("mongoose");
const Project = require("../models/projectModel");
const Leave = require('../models/leaveRequestModel');
const LeaveBoard = require("../models/leaveModel")
const User = require("../models/userModel");

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
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Invalid request" })
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
            approvedBySuperVisor: formattedSvArray,
            isAllLeaderApproved: req.user.role.name === "teamlead" ? true: false,

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
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Invalid request" })
        const userRole = req.user.role.alias
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
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json(errors)
        const userId = req.query.userId
        const pageNumber = parseInt(req.query.pageNumber)
        const pageSize = parseInt(req.query.pageSize)
        const userRole = req.user.role.alias
        const currentYear = new Date().getFullYear()
        const lepYearDay = checkLeapYear(currentYear + 1) ? 29 : 28
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
                    $match: {
                        startDate: {
                            $gte: new Date(`${currentYear}-03-01`),
                            $lte: new Date(`${currentYear + 1}-02-${lepYearDay}`)
                        }
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
                },

                {
                    $facet: {
                        totalCount: [{ $count: "count" }],
                        data: [
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize }
                        ]
                    }
                },

                {
                    $project: {
                        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                        data: 1
                    }
                },


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
                    $match: {
                        startDate: {
                            $gte: new Date(`${currentYear}-03-01`),
                            $lte: new Date(`${currentYear + 1}-02-${lepYearDay}`)
                        }
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
                },
                {
                    $facet: {
                        totalCount: [{ $count: "count" }],
                        data: [
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize }
                        ]
                    }
                },

                {
                    $project: {
                        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                        data: 1
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
                    $match: {
                        startDate: {
                            $gte: new Date(`${currentYear}-03-01`),
                            $lte: new Date(`${currentYear + 1}-02-${lepYearDay}`)
                        }
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
                {
                    $facet: {
                        totalCount: [{ $count: "count" }],
                        data: [
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize }
                        ]
                    }
                },

                {
                    $project: {
                        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                        data: 1
                    }
                }

            ])
            return res.status(200).send(findRequest)
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}


module.exports.createUserLeaveAmount = async (req, res, next) => {
    try {
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
        if (!userId) return res.status(400).json({ "message": "Invalid request" })
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
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json(errors)
        const body = req.body;
        const leaveType = body.leaveType;
        let leaveStartDate = new Date(body.startDate);
        let leaveEndDate = new Date(body.endDate);

        let limit = body.limit ? parseInt(body.limit) : 10;
        let skip = body.skip ? parseInt(body.skip) : 0;
        let args = {}
        let status = {}




        for (let query in body) {
            if (body.leaveStatus.length) {
                if(body.leaveStatus === "declined") {
                    status.isDeclined = true;
                }else{
                    status.isFullyApproved = body?.leaveStatus === "approved" ? true : false
                    status.isDeclined = false;

                }
            }
            if (body.leaveType.length) {
                status.leaveType = body?.leaveType

            }
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

        console.log(status);
        let data = await Leave.aggregate([
            {
                $match: {
                    userId: { $in: args.usersId },
                    startDate: { $gte: leaveStartDate },
                    endDate: { $lte: leaveEndDate },
                    ...status
                }

            },
            {
                $skip: parseInt(limit * skip)
            },


            {
                $limit: limit
            },

            { $sort: { "startDate": -1 } },
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
                    "isDeclined":1,
                    "isAllLeaderApproved":1,
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

module.exports.getLeaveSummary = async (req, res, next) => {
    try {
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json(errors)
        const userId = req.body.userId;
        const isUserAvailable = await User.findOne({ _id: userId }).lean();
        if (!isUserAvailable) return res.status(400).json({ "message": "User Not found" });
        const year = parseInt(req.body.year) || new Date().getFullYear();

        const yearStartDate = new Date(`03/01/${year}`)
        const yearEndDate = new Date(`02/28/${year + 1}`)


        const findUserLeave = await LeaveBoard.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },

            {
                $project: {
                    "leaveAmount": 1,
                    "leaveCategory": 1
                }
            }
        ]);


        const totalLeaveTaken = await Leave.aggregate([
            {
                $match: {
                    userId: { $in: [new mongoose.Types.ObjectId(userId)] },
                    startDate: {
                        $gte: yearStartDate,
                    },
                    endDate: { $lte: yearEndDate },
                    isFullyApproved: true
                }
            },
            {
                $group: {
                    _id: "$leaveType",
                    total: { $sum: "$totalDay" }
                }
            }
        ]);

        // let totalLeaveTakenByUser = [{ _id: "Sick", total: 0 }, { _id: "Casual", total: 0 }, { _id: "Special", total: 0 }]


        return res.status(200).json({ "message": "success", "data": { "totalYearlyLeave": findUserLeave, "totalTaken": totalLeaveTaken } });



    } catch (err) {
        console.log(err);
        next(err)

    }
}


module.exports.updateALeave = async (req, res, next) => {
    try {
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json(errors)
        const _id = req.body._id;
        const userId = req.body.userId;


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
        const errors = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Invalid request" })
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
        if (!leaveDetails.length) return res.status(400).json({ "message": "Data not found" })
        leaveDetails = leaveDetails[0]
        if(status === 'Declined'){
            await Leave.findOneAndUpdate({ _id: leaveId }, {
                $set: {
                    isDeclined:true
                }
            })
        }
        if (role === "admin") {
            await Leave.findOneAndUpdate({ _id: leaveId }, {
                $set: {
                    apporovedAdminId: approverId,
                    isAdminApproved: status,
                    isFullyApproved: status === "Approved" ? true : false
                }
            })
            return res.status(200).json({ "message": "success" })
        }


        if (role === 'projectlead') {
            console.log("hello");
            await Leave.findOneAndUpdate({ _id: leaveId, "approvedBySuperVisor.sId": approverId }, {
                $set: {
                    "approvedBySuperVisor.$.isApproved": status

                }
            })
        }
        if (role === "teamlead") {
            // console.log("team lead", leaveDetails);


            await Leave.findOneAndUpdate({ _id: leaveId, "approvedByLeader.tId": approverId }, {
                $set: {
                    "approvedByLeader.$.isApproved": status

                }
            })
            // console.log("l", l);



        }

        let allLeadtrueFlag = true;
        let allprojectLeadtrueFlag = true;


        let details = await Leave.findOne({ _id: leaveId }).lean();

        for (let lead of details?.approvedByLeader) {
            if (lead.isApproved !== "Approved") {
                allLeadtrueFlag = false
                break;
            }
        }
        for (let lead of details?.approvedBySuperVisor) {
            if (lead.isApproved !== "Approved") {
                allprojectLeadtrueFlag = false
                break;
            }
        }


        console.log("lead", allLeadtrueFlag, "super", allprojectLeadtrueFlag);
        let updated = await Leave.findOneAndUpdate({ _id: leaveId }, { $set: { isAllLeaderApproved: allLeadtrueFlag, isAllSuperVisorApproved: allprojectLeadtrueFlag } }, { new: true })


        return res.status(200).json({ "message": "Success", "data": updated })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

// Filter the leaves
module.exports.searchLeave = async (req, res) => {
    try {

        // const erros = validationMessages(validationResult(req).mapped());
        // if(isErrorFounds(erros)) return res.status(400).json({"errors": erros})
        const userRole = req.user.role.alias
        const selfId = req.query.selfId
        const userId = req.body.userId
        const leaveType = req.body.leaveType
        const isFullyApproved = req.body.isFullyApproved
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const pageNumber = parseInt(req.query.pageNumber)
        const pageSize = parseInt(req.query.pageSize)

        if ((startDate !== '' && endDate === '') || (endDate !== '' && startDate === '')) {
            return res.status(400).json({ message: "Fill Both Start Date and End Date" })
        }

        const matchQuery = {};
        if (userId) {
            matchQuery['userId'] = new mongoose.Types.ObjectId(userId);
        }
        if (leaveType) {
            matchQuery['leaveType'] = leaveType
            //   new monngoose.Types.ObjectId(desgntn);
        }
        if (isFullyApproved !== '') {
            matchQuery['isFullyApproved'] = isFullyApproved;
        }
        if (startDate && endDate) {
            firstDate = new Date(startDate).setHours(0, 0, 0, 0)
            lastDate = new Date(endDate).setHours(23, 59, 59, 999)
            matchQuery['$and'] = [{ startDate: { $gte: new Date(firstDate) } }, { endDate: { $lte: new Date(lastDate) } }];
        }

        var initalMatchQuery = {}
        var approvedProjection = {}
        const project = {
            $project: {
                _id: 1,
                userId: 1,
                leaveType: 1,
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
        }

        if (userRole === 'Team Lead') {
            initalMatchQuery = {
                $match: {
                    $and: [
                        { 'approvedByLeader.tId': new mongoose.Types.ObjectId(selfId) },
                        { 'userId': { $ne: new mongoose.Types.ObjectId(selfId) } }
                    ]

                }
            }

            approvedProjection = {
                $filter: {
                    input: "$approvedByLeader",
                    as: "leader",
                    cond: { $eq: ["$$leader.tId", new mongoose.Types.ObjectId(selfId)] }
                }
            }
            project.$project['isApproved'] = approvedProjection
        }
        if (userRole === 'Project Lead') {
            initalMatchQuery = {
                $match: {
                    $and: [
                        { 'approvedBySuperVisor.sId': new mongoose.Types.ObjectId(selfId) },
                        { 'userId': { $ne: new mongoose.Types.ObjectId(selfId) } },
                        { 'isAllLeaderApproved': { $eq: true } }
                    ]

                }
            }

            approvedProjection = {
                $filter: {
                    input: "$approvedBySuperVisor",
                    as: "superVisor",
                    cond: { $eq: ["$$superVisor.sId", new mongoose.Types.ObjectId(selfId)] }
                }
            }
            approvedProjection = {
                $filter: {
                    input: "$approvedByLeader",
                    as: "leader",
                    cond: { $eq: ["$$leader.tId", new mongoose.Types.ObjectId(selfId)] }
                }
            }
            project.$project['isApproved'] = approvedProjection
        }
        if (userRole === 'Admin') {
            initalMatchQuery = {
                $match: {
                    $and: [
                        { 'isAllLeaderApproved': { $eq: true } },
                        { 'isAllSuperVisorApproved': { $eq: true } },
                        { 'userId': { $ne: new mongoose.Types.ObjectId(selfId) } }
                    ]

                }
            }

        }

        const result = await Leave.aggregate([
            initalMatchQuery,
            { $match: matchQuery },
            project,
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
                    isAdminApproved: 1,

                }
            },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    data: [
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize }
                    ]
                }
            },

            {
                $project: {
                    totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                    data: 1
                }
            }

        ])
        console.log(matchQuery);

        return res.status(200).send(result)

    } catch (e) {
        console.log(e);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

// helper 

const isLeaveAvailabe = async (leaveId, approverId, role) => {
    let matchQuery = {}
    if (role === "admin") {
        matchQuery = {
            $match: { _id: new mongoose.Types.ObjectId(leaveId), isAllLeaderApproved: true, isAllSuperVisorApproved: true }
        }
    }
    if (role === 'teamlead') {
        matchQuery = {
            $match: {
                $and: [
                    { _id: new mongoose.Types.ObjectId(leaveId) },

                    {
                        $or: [
                            { "approvedByLeader.tId": new mongoose.Types.ObjectId(approverId) }
                        ]
                    }

                ]
            }
        }
    }
    if (role === 'projectlead') {
        matchQuery = {
            $match: {
                $and: [
                    { _id: new mongoose.Types.ObjectId(leaveId) },

                    {
                        $or: [
                            { "approvedBySuperVisor.sId": new mongoose.Types.ObjectId(approverId) }
                        ]
                    }

                ]
            }
        }
    }
    const details = await Leave.aggregate([
        matchQuery
    ])
    return details;
}


function checkLeapYear(year) {

    //three conditions to find out the leap year
    if ((0 === year % 4) && (0 !== year % 100) || (0 === year % 400)) {
        return true
    }
    return false
}