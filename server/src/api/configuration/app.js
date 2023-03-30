require("express-async-errors");
const express = require("express");
const app = express();
const { notFoundUrl } = require("../middleware/notFoundMiddleware");
const errorMiddleware = require("../middleware/errorMiddleware");


// index middleware
require('./index')(app);

//routes middleware
require("./routes")(app);

    //not found url
app.use(notFoundUrl);

    //default error handeling by express
app.use(errorMiddleware);

module.exports = app;

