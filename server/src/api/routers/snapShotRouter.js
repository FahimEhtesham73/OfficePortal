const { createSnapShot} = require("../controllers/snapShotController.js");
const {Authorize} = require("../middleware/commonMilddleware");
const { updateAttendenceValidation, getAttendenceValidation, modifyAttendenceValidation, createAttendenceValidation, getTodaysAttendenceValidation } = require("../util/validator/attendenceValidation");

const router = require("express").Router();

router.route("/createsnapshot").post(createSnapShot) //punch in


module.exports = router;
// getAttendenceValidation,upadateFromMachine