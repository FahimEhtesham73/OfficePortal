const { createSubProject, updateSubProject, getAllSubProject, getASubPoroject,deleteSingleSubProject, searchProject } = require("../controllers/subProjectController");
const {Authorize,isAdminAndManager, isAdminTeamLeadProjectLead, isAdmin} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation, createSubProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

router.route("/all/:id").get(Authorize, getAllSubProject);
// router.route("/")
router.route("/create/:id").post(Authorize,isAdminAndManager,createSubProjectValidation,createSubProject);
router.route("/update/:id/:subid").put(Authorize,isAdminTeamLeadProjectLead, upateProjectValidation,updateSubProject);
router.route("/delete").delete(Authorize,isAdminAndManager,deleteSingleSubProject);
router.route("/:id/:subid").get(Authorize, getASubPoroject);
router.route("/searchProject/user/:userId").get(searchProject);

module.exports = router;
