const { getAllRoles } = require("../controllers/roleController");

const router = require("express").Router();

router.route("/all").get(getAllRoles)
module.exports = router;
