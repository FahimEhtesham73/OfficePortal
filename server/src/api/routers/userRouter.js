const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser } = require("../controllers/userController");
const { hasPermission } = require("../middleware/commonMilddleware");

router.route("/getalluser").get(allUser); // get all user
router.route("/create").post(createUser); // create a user
router.route("/signin").post(signinUser);
router.route("/getsingleuser/:id").get(getSingleUser)
router.route("/updateUser/:id").put(updateSingleUser)
// router.route("/delete").delete(deleteSingleUser);

module.exports = router;