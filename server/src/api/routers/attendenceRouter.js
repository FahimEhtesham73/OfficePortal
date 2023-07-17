const { createAttendence, getAttendences, updateAttendece, getTodayAttendence,getAllUserAttendenceSheet, todaysPunchInUsers, modifiedORCreateAttendence } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware");
const { updateAttendenceValidation, getAttendenceValidation, modifyAttendenceValidation, createAttendenceValidation, getTodaysAttendenceValidation } = require("../util/validator/attendenceValidation");

const router = require("express").Router();

router.route("/create").post(Authorize, createAttendenceValidation, createAttendence) //punch in
router.route("/getall").post(Authorize, getAttendenceValidation,  getAttendences) //get all attendeces
router.route("/update").put(Authorize, updateAttendenceValidation, updateAttendece) //update a attendece
router.route("/today").post(Authorize, getTodaysAttendenceValidation, getTodayAttendence)
router.route("/alluseratendance").post(Authorize, getAllUserAttendenceSheet)
router.route("/todayspunch").get(Authorize,todaysPunchInUsers)
router.route("/modify").post(Authorize, modifyAttendenceValidation, modifiedORCreateAttendence);

module.exports = router;
// getAttendenceValidation,