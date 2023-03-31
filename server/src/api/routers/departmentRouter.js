const { getAllDept } = require("../controllers/departmentController");

const router = require("express").Router();
router.route("/all").get(getAllDept)
module.exports = router;
