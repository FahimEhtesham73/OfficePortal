const {
  createHoliday,
  allHoliday,
  singleHoliday,
  updateHoliday,
  deleteHoliday,
} = require("../controllers/holidayController");
const { Authorize } = require("../middleware/commonMilddleware");
const {
  updateAttendenceValidation,
  getAttendenceValidation,
} = require("../util/validator/attendenceValidation");

const router = require("express").Router();

router.route("/createholiday").post(Authorize, createHoliday); //punch in
router.route("/getallholiday").get(Authorize, allHoliday); //get all attendeces
router.route("/getsingleholiday/:id").get(Authorize, singleHoliday); //get all attendeces
router.route("/updatesingleholiday/:id").put(Authorize, updateHoliday); //get all attendeces
// router.route("/update").put(Authorize, updateAttendenceValidation, updateAttendece) //update a attendece
router.route("/deleteholiday/:id").delete(Authorize, deleteHoliday);
// router.route("/alluseratendance").post(getAllUserAttendenceSheet)

module.exports = router;
// getAttendenceValidation,
