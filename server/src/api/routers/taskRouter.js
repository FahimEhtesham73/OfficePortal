const { createATask, getAllTaskForAProject, updateATask, getSingleTask, deleteATask, filterTask, projectTaskSummery } = require("../controllers/taskController");
const {Authorize} = require("../middleware/commonMilddleware");
const { taskCreationValidation, taskUpdateValidation, filterTaskValidation } = require("../util/validator/taskValidation");

const router = require("express").Router();

router.route("/").get(Authorize, getAllTaskForAProject) 
router.route("/get-task").get(Authorize, getSingleTask)
router.route("/create").post(Authorize, taskCreationValidation , createATask)
router.route("/update").post(Authorize , taskUpdateValidation, updateATask) 
router.route("/deletetask").delete(Authorize , deleteATask) 
router.route("/filter").post(Authorize , filterTaskValidation, filterTask) 
router.route("/summary").post(Authorize , filterTaskValidation, projectTaskSummery) 





module.exports = router;
// getAttendenceValidation,