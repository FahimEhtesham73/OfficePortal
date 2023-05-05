const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser,searchUser } = require("../controllers/userController");
const { hasPermission, Authorize } = require("../middleware/commonMilddleware");
const { createEmployeeValidation, signinValidation, signinDataValidation,searchEmployeeValidation, updateSingleUserValidation } = require("../util/validator/userValidation");

router.route("/getalluser").get(allUser); // get all user
router.route("/create").post(hasPermission, createEmployeeValidation, createUser); // create a user
router.route("/signin").post(signinDataValidation ,signinUser);
router.route("/getsingleuser/:id").get(getSingleUser)
router.route("/updateUser/:id").put(Authorize,updateSingleUserValidation,updateSingleUser)
router.route("/searchuser").post(searchEmployeeValidation,searchUser)
// router.route("/delete").delete(deleteSingleUser);

module.exports = router;