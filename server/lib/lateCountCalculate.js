module.exports.lateCountCalculate = (lateAttendance, currentMonth) => {

    let lateRecordResponseCount
    if (!lateAttendance) {
        lateRecordResponseCount = 0
    }
    else {
        let lateRecordResponse = lateAttendance.monthlyLateRecords.filter((val, index) => {
            if (val.month === currentMonth) {
                return val
            }
        })

        lateRecordResponseCount = lateRecordResponse[0]?.lateCount || 0
    }

    return lateRecordResponseCount
}