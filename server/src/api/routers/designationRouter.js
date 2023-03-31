const router = require("express").Router();
const { getAllDesignation } = require("../controllers/designationController");


router.route("/all").get(getAllDesignation)
module.exports = router;
