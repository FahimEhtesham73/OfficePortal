const { createAttendence, getAttendences, updateAttendece, getTodayAttendence,getAllUserAttendenceSheet, todaysPunchInUsers, modifiedORCreateAttendence } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware");
const { updateAttendenceValidation, getAttendenceValidation, modifyAttendenceValidation } = require("../util/validator/attendenceValidation");

const router = require("express").Router();

router.route("/create").post(Authorize, createAttendence) //punch in
router.route("/getall").post(Authorize,  getAttendences) //get all attendeces
router.route("/update").put(Authorize, updateAttendenceValidation, updateAttendece) //update a attendece
router.route("/today").post(Authorize, getTodayAttendence)
router.route("/alluseratendance").post(getAllUserAttendenceSheet)
router.route("/todayspunch").get(todaysPunchInUsers)
router.route("/modify").post(Authorize, modifyAttendenceValidation, modifiedORCreateAttendence);

module.exports = router;
// getAttendenceValidation,