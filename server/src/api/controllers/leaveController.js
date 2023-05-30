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
        console.log("user role from cookie",userRole);
        const { userId,leaveType,startDate,endDate,totalDay,leaveReason } = req.body

        let groupStage
        let matchStage
        if(userRole === 'Employee'){
            matchStage = {
                $match: {
                    projectMembers: new mongoose.Types.ObjectId(userId)
                },
            }
            groupStage = {
                $group: {
                    _id: null,
                    mergedTeamLeaders: { $push: '$projectLead'},
                    mergedSuperVisor:{$push:'$projectSuperVisor'}
                }
            }
        }else if(userRole === 'Team Lead'){
            console.log('entered');
            matchStage = {
                $match: {
                    projectLead: new mongoose.Types.ObjectId(userId)
                },
            }

            groupStage = {
                $group: {
                    _id: null,
                    mergedSuperVisor:{$push:'$projectSuperVisor'}
                }
            }
        }

            const findTeamLeader = await Project.aggregate([
                matchStage,
                groupStage
            ])
    
            const tempArrLeader = userRole === 'Employee' && findTeamLeader[0]?.mergedTeamLeaders?.flat() || [] 
            const tempArrSv = findTeamLeader[0]?.mergedSuperVisor?.flat() || []

            if(userRole === 'Employee' && tempArrLeader.length===0 || tempArrSv.length===0){
                return res.status(400).json({message:"you are not assigned any team leader or supervisor"})
            }
    
            // converting the object id into string to check duplicate value
            const stringLeaderArray = userRole === 'Employee' && tempArrLeader.map(objectId => objectId.toString());
            const stringSvArray = tempArrSv.map(objectId => objectId.toString());
    
            const mergedLeaderArr = userRole === 'Employee' && [...new Set(stringLeaderArray)]
            const mergedSvArr =  [...new Set(stringSvArray)]
    
            // making unique array to database model format
            const formattedLeaderArr = userRole === 'Employee'?mergedLeaderArr.map(val=> {return {tId:val}}):[{tId:userId,isApproved:"Approved"}]
            const formattedSvArray = mergedSvArr.map(val=> {return {sId:val}})
    
            const data = {
                userId,
                leaveType,
                startDate,
                endDate,
                totalDay,
                leaveReason,
                approvedByLeader:formattedLeaderArr,
                approvedBySuperVisor:formattedSvArray
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