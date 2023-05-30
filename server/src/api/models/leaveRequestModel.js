const { Schema, model } = require("mongoose")
const leaveRequestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    leaveType: { type: String, },
    approvedByLeader: [{
        tId: {
            type: Schema.Types.ObjectId
        },
        isApproved: {
            type: String,
            enum: ['Pending', 'Approved', 'Declined'],
            default: 'Pending'
        }
    }],
    approvedBySuperVisor: [{
        sId: {
            type: Schema.Types.ObjectId
        },
        isApproved: {
            type: String,
            enum: ['Pending', 'Approved', 'Declined'],
            default: 'Pending'
        },
        isAllLeaderApproved: {
            type: Boolean,
            default: false
        }
    }],
    isAdminApproved: {
        type: Boolean,
        default: false
    },
    isApprovedFinal:{
        type: Boolean,
        default: false
    },
    startDate: Date,
    endDate: Date,
    isFullyApproved: Boolean,
    leaveReason: String,
    totalDay:Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: "000000000000000000000000" }
}, { timestamps: true });


module.exports = model("LeaveRequest", leaveRequestSchema);