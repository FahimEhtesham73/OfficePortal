const { createAttendence } = require("../controllers/attendenceController");
const {Authorize} = require("../middleware/commonMilddleware")

const router = require("express").Router();

router.route("/create").post(createAttendence) //punch in

module.exports = router;