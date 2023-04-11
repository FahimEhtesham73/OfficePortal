const { createAttendence, getAttendences, updateAttendece } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware")

const router = require("express").Router();

router.route("/create").post(Authorize, createAttendence) //punch in
router.route("/getall").get(Authorize, getAttendences) //get all attendeces
router.route("/update").put(Authorize, updateAttendece) //update a attendece

module.exports = router;