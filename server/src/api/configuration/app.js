require("express-async-errors");
const path = require("path")
const express = require("express");
const app = express();
const { notFoundUrl } = require("../middleware/notFoundMiddleware");
const errorMiddleware = require("../middleware/errorMiddleware");

// index middleware
require('./index')(app);

//routes middleware
require("./routes")(app);

//images routes
app.use("/images", express.static(path.join(path.resolve(process.env.FILESTORAGE), "images")))
app.use("/videos", express.static(path.join(path.resolve(process.env.FILESTORAGE), "videos")))

    //not found url
app.use(notFoundUrl);

    //default error handeling by express
app.use(errorMiddleware);

module.exports = app;

