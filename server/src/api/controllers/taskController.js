const ProjectTask = require("./../models/projectTaskModel");
const Project = require("../models/projectModel");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { default: mongoose } = require("mongoose");
const { taskLookupStage, taskProjectStage } = require("../util/taskCommonTemplate");
const subProject = require("../models/subProjectModel");
module.exports.createATask = async (req, res) => {
    try {

        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
        const {
            taskName,
            projectCode,
            assignedMembers,
            startTime,
            endTime,
            totalHour,
            progress,
            priority,
            status,
            additionalNotes,
            taskType,


        } = req.body;


        const isPojectAvialable = await subProject.findOne({ projectCode: projectCode }).lean();
        if (!isPojectAvialable) return res.status(400).json({ "message": "Project not found" });
        const isSameNameTaskAvialble = await ProjectTask.findOne({ projectCode: projectCode, taskName: taskName }).lean();
        if (isSameNameTaskAvialble) return res.status(400).json({ "message": "Task already added" });

        // const memberPresentInthisProject
        let body = req.body;
        let args = { taskName, progress, status, totalHour, taskType, priority, additionalNotes, assignedMembers, projectId: isPojectAvialable._id, projectCode: isPojectAvialable.projectCode, createdBy: req.user._id, updatedBy: req.user._id };
        for (let arg in body) {
            if (arg === "startTime") {
                args['startTime'] = body['startTime']
            }
            if (arg === "endTime") {
                args['endTime'] = body['endTime']
            }
        }

        console.log("data", args);

        const newTask = await new ProjectTask(args).save();
        let newTaskDetails = await ProjectTask.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(newTask._id)
                }
            },
            taskLookupStage,
            taskProjectStage
        ])
        console.log("new db task", newTask);

        return res.status(200).json({ "message": "success", "data": newTaskDetails });


    } catch (e) {
        console.log(e);
        return res.status(500).json({ "message": "server error" });
    }
}

module.exports.getAllTaskForAProject = async (req, res) => {
    try {

        let projectCode = req.query.pid;
        if (!projectCode) return res.status(400).json({ 'message': 'invalid request' })
        const isProjectAvialable = await subProject.findOne({ projectCode: projectCode }).lean();
        if (!isProjectAvialable) return res.status(400).json({ 'message': 'no data' })
        projectCode = projectCode.trim().toUpperCase()
        const isUserIn = await isUserInthisProject(projectCode, req.user._id);

        if (isUserIn.length > 0 || req.user.role.name === "admin") {

            const allTask = await ProjectTask.aggregate([
                {
                    $match: {
                        projectId: new mongoose.Types.ObjectId(isProjectAvialable._id),
                    }
                },


                taskLookupStage,
                taskProjectStage,

            ]);

            return res.status(200).json({ "message": "success", data: allTask });
        }

        return res.status(400).json({ "message": "Data not found" })

    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "message": "server error" });

    }
}

module.exports.getSingleTask = async (req, res) => {
    try {
        const taskid = req.query.taskId;
        const projectCode = req.query.pcd;
        if (!taskid || !projectCode) return res.status(400).json({ 'message': 'invalid request' })
        const isUserIn = await isUserInthisProject(projectCode, req.user._id);
        if (isUserIn.length || req.user.role.name === 'admin') {
            const isTask = await ProjectTask.findOne({ _id: taskid, projectCode: projectCode }).lean();
            if (!isTask) return res.status(400).json({ "message": "data not found" });

            const data = await ProjectTask.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(taskid),
                        projectCode: projectCode,
                    }
                },
                taskLookupStage,
                taskProjectStage,
            ])
            return res.status(200).json({ "message": "success", data: data })
        }
        return res.status(403).json({ "message": "Access denied" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "server error" })
    }
}

module.exports.updateATask = async (req, res) => {
    try {

        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros })
        const taskId = req.body.taskid;
        const projectCode = req.body.pcd;
        const updatedData = req.body.updatedData;
        const args = {}
        const task = await ProjectTask.findOne({ _id: taskId, projectCode }).lean();
        if (!task) return res.status(400).json({ "message": "data not found" });

        const isUserIn = await isUserInthisProject(projectCode, req.user._id);

        if ((isUserIn.length > 0 && (task.assignedMembers.map(v => v.toString()).includes(req.user._id) ||
            isUserIn[0]?.projectSuperVisor?.map(v => v.toString()).includes(req.user._id)
            || isUserIn[0]?.projectLead?.map(v => v.toString()).includes(req.user._id)
        )) || req.user.role.name === "admin") {

            for (let arg in updatedData) {
                if (arg == "taskName") {
                    args['taskName'] = updatedData['taskName']
                }
                if (arg == "assignedMembers") {
                    args['assignedMembers'] = updatedData['assignedMembers']
                }
                if (arg == "startTime") {
                    args['startTime'] = updatedData['startTime']
                }
                if (arg == "endTime") {
                    args['endTime'] = updatedData['endTime']
                }
                if (arg == "status") {
                    args['status'] = updatedData['status']
                }
                if (arg == "additionalNotes") {
                    args['additionalNotes'] = updatedData['additionalNotes']
                }
                if (arg == "totalHour") {
                    args['totalHour'] = updatedData['totalHour']
                }
                if (arg == "progess") {
                    args['progess'] = updatedData['progess']
                }
                if (arg == "priority") {
                    args['priority'] = updatedData['priority']
                }
                if (arg == "taskType") {
                    args['taskType'] = updatedData['taskType']
                }
            }

            let isTaskNameAvliable = await ProjectTask.findOne({ projectCode: args.projectCode, taskName: args.taskName }).lean();
            if (isTaskNameAvliable) return res.status(400).json({ "message": "Task name already in task list" })
            let u = await ProjectTask.updateOne({ _id: taskId, projectCode }, { $set: { ...args } });
            // if(updatedTask)
            let updatedTaskData = await ProjectTask.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(taskId),
                        projectCode: projectCode
                    }
                },
                taskLookupStage,
                taskProjectStage,
            ])
            return res.status(200).json({ "message": "success", data: updatedTaskData })
        }

        return res.status(403).json({ "message": "Access denied" })



    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "server error" })
    }
}

module.exports.deleteATask = async (req, res) => {
    try {
        const taskid = req.query.taskId;
        const projectCode = req.query.pcd;
        if (!taskid || !projectCode) return res.status(400).json({ 'message': 'invalid request' })

        const isUserIn = await isUserInthisProject(projectCode, req.user._id);
        if (isUserIn.length || req.user.role.name === 'admin') {
            const isTask = await ProjectTask.findOne({ _id: taskid, projectCode: projectCode }).lean();
            if (!isTask) return res.status(400).json({ "message": "data not found" });

            await ProjectTask.findOneAndDelete({ _id: taskid, projectCode: projectCode })
            return res.status(200).json({ "message": "deleted successfully" })
        }
        return res.status(403).json({ "message": "Access denied" })

    } catch (err) {
        return res.status(500).json({ "message": "server error" })
    }
}

module.exports.filterTask = async (req, res) => {
    try {

        const erros = validationMessages(validationResult(req).mapped());
        if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros });
        const query = req.body.query;
        const projectCode = req.body.pcd;
        const isUserIn = await isUserInthisProject(projectCode, req.user._id);
        let args = {}
        let matchQuery = {}
        let sortBy = query.sortBy === "asc" ? 1 : -1;
        const LIMIT = parseInt(query.limit) || 10;
        const Page = parseInt(query.page) || 1;
        if (isUserIn.length) {

            matchQuery['assignedMembers'] = { $in: [new mongoose.Types.ObjectId(req.user._id)] }
        }
        if (isUserIn.length > 0 || req.user.role.name === "admin") {
            if (!query?.startTime?.length && !query?.endTime?.length) {
                let { firstday, lastday } = getFirstAndLastDay(new Date())

                //  matchQuery = {
                //     // startTime: {$gte: new Date(new Date(firstday).setHours(0,0,0,0))},
                //     // endTime: {$lte: new Date(new Date(lastday).setHours(23,59,59,59))}
                // }

            }

            for (let q in query) {
                if (q === "userId" && query['userId'].length) {
                    args.assignedMembers = query.userId.map(v => new mongoose.Types.ObjectId(v))
                }
                if (q === 'startTime') {
                    args.startTime = query['startTime'];
                }
                if (q === 'endTime') {
                    args.endTime = query['endTime'];
                }
                if (q === 'priority') {
                    args.priority = query['priority']
                }
                if (q === 'taskType') {
                    args.taskType = query['taskType']

                }
                if (q === 'status') {
                    args.status = query['status']

                }

            }
            // console.log("args",args);

            if (args.assignedMembers) {
                matchQuery['assignedMembers'] = { $in: args.assignedMembers }
            }
            if (args?.startTime?.length) {
                matchQuery['startTime'] = { $gte: new Date(new Date(args.startTime).setHours(0, 0, 0, 0)) }
            }
            if (args?.endTime?.length) {
                matchQuery['endTime'] = { $lte: new Date(new Date(args.endTime).setHours(23, 59, 59, 999)) }

            }
            if (args?.priority?.length) {
                matchQuery['priority'] = { $in: args.priority }

            }
            if (args?.taskType?.length) {
                matchQuery['taskType'] = { $in: args.taskType };

            }
            if (args?.status?.length && args?.status === "missed") {
                // matchQuery['status'] = { $in: args.status };
                matchQuery['endTime'] = { $lt: new Date() }
                matchQuery.status = { $nin: ["done", "pause"] }
                // matchQuery['status'] = {$nin: ["done", "pause"]},

            }
            else if (args?.status?.length) {
                matchQuery['status'] = { $eq: args.status };

            }

            const allTask = await ProjectTask.aggregate([
                {
                    $match: {
                        projectCode: projectCode,
                        ...matchQuery
                    }
                },


                taskLookupStage,
                taskProjectStage,
                {
                    $sort: { endTime: sortBy, _id: sortBy }
                },
                {
                    $skip: parseInt(Page - 1) * LIMIT
                },
                {
                    $limit: LIMIT
                }

            ]);

            return res.status(200).json({ "message": "success", data: allTask });
        }

        return res.status(400).json({ "message": "Data not found" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "server error" });
    }
}


module.exports.projectTaskSummery = async (req, res, next) => {
    try {
        const projectCode = req.query.projectCode;
        const query = req.body.query;
        const args = {};
        const matchQuery = {};
        if (!projectCode) return res.status(400).json({ "message": "Invalid query" });

        const isUserIn = await isUserInthisProject(projectCode, req.user._id);

        if (isUserIn.length) {
            matchQuery['assignedMembers'] = { $in: [new mongoose.Types.ObjectId(req.user._id)] }
        }
        if (isUserIn.length || req.user.role.name === "admin") {
            for (let q in query) {
                if (q === "userId" && query['userId'].length) {
                    args.assignedMembers = query.userId.map(v => new mongoose.Types.ObjectId(v))
                }
                if (q === 'startTime') {
                    args.startTime = query['startTime'];
                }
                if (q === 'endTime') {
                    args.endTime = query['endTime'];
                }
                if (q === 'priority') {
                    args.priority = query['priority']
                }
                if (q === 'taskType') {
                    args.taskType = query['taskType']

                }
                if (q === 'status') {
                    args.status = query['status']

                }

            }

            if (args.assignedMembers) {
                matchQuery['assignedMembers'] = { $in: args.assignedMembers }
            }
            if (args?.startTime?.length) {
                matchQuery['startTime'] = { $gte: new Date(new Date(args.startTime).setHours(0, 0, 0, 0)) }
            }
            if (args?.endTime?.length) {
                matchQuery['endTime'] = { $lte: new Date(new Date(args.endTime).setHours(23, 59, 59, 999)) }

            }
            if (args?.priority?.length) {
                matchQuery['priority'] = { $in: args.priority }

            }
            if (args?.taskType?.length) {
                matchQuery['taskType'] = { $in: args.taskType };

            }
            //new changes
            if (args?.status?.length && args?.status === "missed") {
                // matchQuery['status'] = { $in: args.status };
                matchQuery['endTime'] = { $lt: new Date() }
                matchQuery.status = { $nin: ["done", "pause"] }
                // matchQuery['status'] = {$nin: ["done", "pause"]},

            }
            else if (args?.status?.length) {
                matchQuery['status'] = { $eq: args.status };

            }


            console.log("match", matchQuery);



            const taskSummery = await ProjectTask.aggregate([
                {
                    $match: {
                        projectCode: projectCode,
                        ...matchQuery
                    }
                },
                {

                    $facet: {
                        "totalCount": [{ $count: "total" },],
                        "totalDeadelineToday": [
                            {
                                $match: {
                                    status: { $nin: ["done", "pause"] },
                                    endTime: {
                                        $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
                                        $lte: new Date(new Date().setHours(23, 59, 59, 999)) // End of today
                                    }
                                }
                            }
                            ,
                            {
                                $count: "total"
                            }
                        ],
                        "totalTodo": [{ $match: { status: "todo" } }, { $count: "total" }],
                        "totalInProgress": [{ $match: { status: "in progress" } }, { $count: "total" }],
                        "totalInPause": [{ $match: { status: "pause" } }, { $count: "total" }],
                        "totalDone": [{ $match: { status: "done" } }, { $count: "total" }],
                        "deadline": [
                            {
                                $match: {
                                    endTime: { $lt: new Date() },
                                    status: { $nin: ["done", "pause"] }
                                }
                            },
                            {
                                $count: "total"
                            }
                        ]
                    }
                },

                {
                    $project: {
                        "totalDeadelineToday": { $ifNull: [{ $arrayElemAt: ["$totalDeadelineToday.total", 0] }, 0] },
                        "totalTasks": { $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0] },
                        "summary.totalTodoTasks": { $ifNull: [{ $arrayElemAt: ["$totalTodo.total", 0] }, 0] },
                        "summary.totalInProgressTasks": { $ifNull: [{ $arrayElemAt: ["$totalInProgress.total", 0] }, 0] },
                        "summary.totalPasueTask": { $ifNull: [{ $arrayElemAt: ["$totalInPause.total", 0] }, 0] },
                        "summary.totalDoneTasks": { $ifNull: [{ $arrayElemAt: ["$totalDone.total", 0] }, 0] },
                        "summary.totalDeadlineMissedTasks": { $ifNull: [{ $arrayElemAt: ["$deadline.total", 0] }, 0] },
                    }
                }
            ]);
            return res.status(200).json({ "message": "Success", "data": taskSummery })
        }

        return res.status(404).json({ "message": "Invalid Request" })

    } catch (err) {
        console.log(err);
        next(err)
    }
}


/************ helper function **************/

const isUserInthisProject = async (projectCode, userId) => {
    return await subProject.aggregate([
        {
            $match: {
                projectCode: projectCode,
                $or: [
                    {
                        projectSuperVisor: new mongoose.Types.ObjectId(userId)
                    },
                    {
                        projectLead: new mongoose.Types.ObjectId(userId)
                    },
                    {
                        projectMembers: new mongoose.Types.ObjectId(userId)
                    },
                ]
            }
        }

    ]);

}

const getFirstAndLastDay = (currentDate) => {
    let curr = new Date(currentDate); // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstday = new Date(curr.setDate(first)).toUTCString();
    let lastday = new Date(curr.setDate(last)).toUTCString();
    return { firstday, lastday }
} 