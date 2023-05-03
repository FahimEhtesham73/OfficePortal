const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser,searchUser } = require("../controllers/userController");
const { hasPermission } = require("../middleware/commonMilddleware");
const { createEmployeeValidation, signinValidation, signinDataValidation,searchEmployeeValidation } = require("../util/validator/userValidation");

router.route("/getalluser").get(allUser); // get all user
router.route("/create").post(hasPermission, createEmployeeValidation, createUser); // create a user
router.route("/signin").post(signinDataValidation ,signinUser);
router.route("/getsingleuser/:id").get(getSingleUser)
router.route("/updateUser/:id").put(updateSingleUser)
router.route("/searchuser").post(searchEmployeeValidation,searchUser)
// router.route("/delete").delete(deleteSingleUser);

module.exports = router;