const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser,searchUser } = require("../controllers/userController");
const { hasPermission,Authorize } = require("../middleware/commonMilddleware");
const { createEmployeeValidation, signinValidation, signinDataValidation,searchEmployeeValidation } = require("../util/validator/userValidation");

router.route("/getalluser").get(Authorize,allUser); // get all user
router.route("/create").post(Authorize,hasPermission, createEmployeeValidation, createUser); // create a user
router.route("/signin").post(signinDataValidation ,signinUser);
router.route("/getsingleuser/:id").get(Authorize,getSingleUser)
router.route("/updateUser/:id").put(Authorize,updateSingleUser)
router.route("/searchuser").post(Authorize,searchEmployeeValidation,searchUser)
// router.route("/delete").delete(deleteSingleUser);

module.exports = router;