require("dotenv").config();
const address =  require('address')
const mongoose = require("mongoose");
var app = require("./api/configuration/app");
const PORT = process.env.PORT;
const local_DB = `mongodb://localhost:27017/nsl`
// `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
const atlas_DB = process.env.DB_URL
// process.env.DB_URL; //local db url
const db = process.env.DB;
console.log(address.ip());
//db connection
(async function dbConnection(url) {
   await mongoose.connect(url);

})(local_DB).then(() => console.log("Successfully DB Connected"))
   .catch(err => console.log("DB Not Connected", err))

// app.get('/',(req,res)=>{
//    return res.json({"message":"Hi, I'm Called"})
// })
app.listen(PORT, () => {
   console.log(`Listening on Port ${PORT}.....`);
})

