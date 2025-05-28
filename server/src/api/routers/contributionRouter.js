const { createContribution, getProjectContributionSingleDay, deleteProjectContributionSingleDay, getProjectContribution } = require("../controllers/contributionController");
const {Authorize,isAdminAndManager, isAdminTeamLeadProjectLead, isAdmin} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation, createSubProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

// router.route("/all/:id").get(Authorize, getAllSubProject);
// router.route("/")
router.route("/createContribution").post(Authorize,createContribution);
router.route("/getSingleDayContribution").post(Authorize, getProjectContributionSingleDay);
router.route("/deleteSingleDayContribution").post(Authorize, deleteProjectContributionSingleDay);
router.route('/getplanner').post(getProjectContribution)

module.exports = router;