const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser } = require("../controllers/userController");
const { hasPermission } = require("../middleware/commonMilddleware");

router.route("/signin").post(signinUser); // get all user
router.route("/create").post(createUser); // create a user
// router.route("/signin").post(signinUser); 
// router.route("/delete").delete(deleteSingleUser);

module.exports = router;