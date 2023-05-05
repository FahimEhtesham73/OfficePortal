const { createAttendence, getAttendences, updateAttendece, getTodayAttendence,getAllUserAttendenceSheet } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware");
const { updateAttendenceValidation, getAttendenceValidation } = require("../util/validator/attendenceValidation");

const router = require("express").Router();

router.route("/create").post(Authorize, createAttendence) //punch in
router.route("/getall").post(Authorize,  getAttendences) //get all attendeces
router.route("/update").put(Authorize, updateAttendenceValidation, updateAttendece) //update a attendece
router.route("/today").post(Authorize, getTodayAttendence)
router.route("/alluseratendance").post(Authorize,getAllUserAttendenceSheet)

module.exports = router;
// getAttendenceValidation,