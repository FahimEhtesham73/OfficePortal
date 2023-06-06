const { createProject, updateProject, getAllPoroject, getAPoroject,deleteSingleProject } = require("../controllers/projectController");
const {Authorize,isAdminAndManager, isAdminTeamLeadProjectLead, isAdmin} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

router.route("/all").get(Authorize, getAllPoroject);
// router.route("/")
router.route("/create").post(Authorize,isAdminAndManager,createProjectValidation,createProject);
router.route("/update").put(Authorize,isAdminTeamLeadProjectLead, upateProjectValidation,updateProject);
router.route("/delete").delete(Authorize,isAdminAndManager,deleteSingleProject);
router.route("/:id").get(Authorize, getAPoroject);

module.exports = router;
