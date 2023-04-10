const { getAllRoles, createRole } = require("../controllers/roleController");

const router = require("express").Router();

router.route("/all").get(getAllRoles)
router.route("/").post(createRole)
module.exports = router;
