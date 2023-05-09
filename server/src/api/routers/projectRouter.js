const { createProject, updateProject, getAllPoroject } = require("../controllers/projectController");
const {Authorize} = require("../middleware/commonMilddleware")
const router = require("express").Router();

router.route("/all").get(Authorize,getAllPoroject);
router.route("/")
router.route("/create").post(Authorize, createProject);
router.route("/update").put(Authorize, updateProject);


module.exports = router;
