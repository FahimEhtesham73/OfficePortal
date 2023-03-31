require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./api/configuration/app");
const PORT = process.env.PORT || 3001 ;

// const production_DB = process.env.NSL_DB; 
const local_DB = "mongodb+srv://cluster0.cetklmc.mongodb.net/nsl_leave_management?retryWrites=true&w=majority"; //local db url

//db connection
(async function dbConnection(url){
   await mongoose.connect(url);

})(local_DB).then(()=> console.log("Successfully DB Connected"))
    .catch(err => console.log("DB Not Connected"))

app.listen(PORT, ()=>{
   console.log(`Listening on Port ${PORT}`);
})