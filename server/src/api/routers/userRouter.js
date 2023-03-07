const router = require("express").Router();
const { createUser, deleteSingleUser, allUser, signinUser } = require("../controllers/userController");

router.route("/").post(signinUser);
router.route("/create").post(createUser);
router.route("/alluser").get(allUser);
router.route("/delete").delete(deleteSingleUser);

module.exports = router;