const { getAllRoles, createRole } = require("../controllers/roleController");
const { Authorize, isAdmin } = require("../middleware/commonMilddleware");

const router = require("express").Router();

router.route("/all").get(getAllRoles)
router.route("/").post(Authorize, isAdmin, createRole)
module.exports = router;
