require("express-async-errors");
const path = require("path")
const express = require("express");
const app = express();
const { notFoundUrl } = require("../middleware/notFoundMiddleware");
const errorMiddleware = require("../middleware/errorMiddleware");
const { Authorize } = require("../middleware/commonMilddleware");


// index middleware
require('./index')(app);

//routes middleware
require("./routes")(app);

//images routes
app.use("/images", express.static(path.join(path.resolve("/home/nsl52/SHUVO/projects/nsl_leave_system/nsl_leave/server/assets"), "images")))
    //not found url
app.use(notFoundUrl);

    //default error handeling by express
app.use(errorMiddleware);

module.exports = app;

