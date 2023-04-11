const { createAttendence, getAttendences } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware")

const router = require("express").Router();

router.route("/create").post(Authorize, createAttendence) //punch in
router.route("/getall").get(Authorize, getAttendences)

module.exports = router;