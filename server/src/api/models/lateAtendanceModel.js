// const { Schema, model } = require("mongoose");

// const LateAttendanceSchema = new Schema({
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     monthlyLateRecords: [{
//         month: String, // e.g., "2024-08"
//         lateCount: { type: Number, default: 0 },
//         emailSentDates: [Date], // Track when emails were sent
//     }],
//     disciplinaryActionCount: { type: Number, default: 0 }, // Track if the cycle happens twice in 3 months
// }, { timestamps: true });

// module.exports = model("LateAttendance", LateAttendanceSchema);

const { Schema, model } = require("mongoose");

const LateAttendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    year: {type: Date},
    monthlyLateRecords: [{
        month: String, // e.g., "2024-08"
        lateCount: { type: Number, default: 0 },
        prevLateCount: {type: Number, default: 0},
        emailSentDates: [Date], // Track when emails were sent
    }],
    // Add a new field to track disciplinary actions by three-month groups
    disciplinaryActionCounts: {
        type: Object,
        of: Number,
        default: {
            '0-2': 0,  // January-March
            '3-5': 0,  // April-June
            '6-8': 0,  // July-September
            '9-11': 0  // October-December
        }
    },

}, { timestamps: true });

module.exports = model("LateAttendance", LateAttendanceSchema);
