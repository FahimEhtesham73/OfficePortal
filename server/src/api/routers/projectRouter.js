const { createProject, updateProject, getAllPoroject, getAPoroject,deleteSingleProject } = require("../controllers/projectController");
const {Authorize,isAdminAndManager} = require("../middleware/commonMilddleware")
const { createProjectValidation,upateProjectValidation } = require("../util/validator/projectValidation");
const router = require("express").Router();

router.route("/all").get(Authorize,getAllPoroject);
router.route("/")
router.route("/create").post(Authorize,isAdminAndManager,createProjectValidation,createProject);
router.route("/update").put(Authorize,upateProjectValidation,updateProject);
router.route("/delete").put(Authorize,deleteSingleProject);
router.route("/:id").get(Authorize, getAPoroject);

module.exports = router;
