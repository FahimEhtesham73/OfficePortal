const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");


module.exports = (app)=>{


    app.use(helmet());
    
    // app.use(cors());
    // Adding headers for cors policy
    
    app.use(function (req, res, next) {

        // Website you wish to allow to connect

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        // res.setHeader('Content-Security-Policy', 'script-src http://localhost:3000')
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Accept,filename');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser())
    //dev
    if(process.env.NODE_ENV === 'dev'){
        app.use(morgan('dev'))
    }
}