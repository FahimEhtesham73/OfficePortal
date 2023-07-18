require("dotenv").config();
const address =  require('address')
const mongoose = require("mongoose");
var app = require("./api/configuration/app");
const PORT = process.env.PORT || 3001;
const http = require('http');
const local_DB = "mongodb://172.16.16.54:27017/nsl"; //local db url
const db = process.env.DB;
console.log(address.ip());
//db connection
(async function dbConnection(url) {
   await mongoose.connect(url);

})(local_DB).then(() => console.log("Successfully DB Connected"))
   .catch(err => console.log("DB Not Connected", err))


app.listen(PORT, () => {
   console.log(`Listening on Port ${PORT}`);
})