const leaveCategory = [
    "Annual Casual Leave",
    "Annual Sick Leave",
    "Unpaid Leave"
]



const startTime = new Date("08/05/2015 8:30:00");
const endTime = new Date("08/05/2015 17:30:00")
var msec = endTime.getTime() - startTime.getTime();
var hh = Math.floor(msec / 1000 / 60 / 60);
msec -= hh * 1000 * 60 * 60;
var mm = Math.floor(msec / 1000 / 60);
msec -= mm * 1000 * 60;
var ss = Math.floor(msec / 1000);
msec -= ss * 1000;
console.log(hh + ":" + mm + ":" + ss);


module.exports = {leaveCategory}