const { createLeave,createLeaveSv,getLeaveStatus, createUserLeaveAmount, getLeaveBoardAmount, getAllLeave, deleteALeave, updateALeave, leaveStatusChange, getLeaveSummary,searchLeave } = require("../controllers/leaveController");
const {Authorize,isAdminAndManager, isAdmin, isAdminTeamLeadProjectLead} = require("../middleware/commonMilddleware");
const { createOrUpdateValidation, updateLeveDetailsValidation, getAllLeaveValidation, createLeaveValidation, getLeaveStatusValidation, leavesStatusChangeAPIValidation } = require("../util/validator/leaveValidation");
const { createProjectValidation,upateProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

//individual user wise leave amount
router.route("/userleaves")
            .get(Authorize, getLeaveBoardAmount)
            .post(Authorize, isAdmin, createOrUpdateValidation,createUserLeaveAmount);
router.route("/get-user-leave").post(Authorize, getAllLeaveValidation ,getAllLeave)
router.route("/createleavereqemptl").post(Authorize,createLeaveValidation,createLeave);
router.route("/update").post(Authorize, updateLeveDetailsValidation,updateALeave);
router.route("/leavestatusupdate").post(Authorize, isAdminTeamLeadProjectLead, leavesStatusChangeAPIValidation, leaveStatusChange)
router.route("/deletealeave").delete(Authorize,deleteALeave);

router.route("/createleavereqsvadmin").post(Authorize,createLeaveValidation,createLeaveSv);
router.route("/getleavestatus").get(Authorize,getLeaveStatusValidation, getLeaveStatus);
router.route("/leavesummary").post(Authorize, getLeaveSummary)
router.route('/filterleave').post(Authorize,searchLeave)

module.exports = router;
