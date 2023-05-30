const { createLeave } = require("../controllers/leaveController");
const {Authorize,isAdminAndManager} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

router.route("/createleavereq").post(Authorize,createLeave);

module.exports = router;
