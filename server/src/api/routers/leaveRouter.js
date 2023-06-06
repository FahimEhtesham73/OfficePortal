const { createLeave,createLeaveSv,getLeaveStatus } = require("../controllers/leaveController");
const {Authorize,isAdminAndManager} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

router.route("/createleavereqemptl").post(Authorize,createLeave);
router.route("/createleavereqsvadmin").post(Authorize,createLeaveSv);
router.route("/getleavestatus/:userId").get(Authorize,getLeaveStatus);

module.exports = router;
