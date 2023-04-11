const file = require("node:fs");
const mongoose = require("mongoose");
const RolePermission = require("../models/rolePermissionModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../services/userServices");

async function Authorize (req, res, next){
    console.log("Hit AUth");
        try{
            let headerToken = req.header("Authorization").split(" ")[1].trim();
            const isTokenValid = verifyToken(headerToken);
            console.log(isTokenValid);
            req.user = isTokenValid;
            next();
        }catch(err){
            return res.status(401).json({"message": "Authorization Failed"})
        }
    
    
}

async function hasPermission(req, res, next){
    const url = req.baseUrl+req._parsedUrl.pathname;
    console.log("api point",url)
    // const user = await User.findOne({email: userInformation.email}).lean();
    // const urlsss = req.originalUrl;
    // const permission = await RolePermission.findOne({name: urlsss}).lean();
    // // console.log(permission);
    // console.log(permission.roles.includes(user.role.toString()) );
    // if(permission?.roles.includes(user?.role.toString())){
    //     next();
    // }else{
    //     return res.status(404).json({"message": "forbidden"})
    // }
    next()
    // if(userInformation.role)
}


// sign in token generation

function generateJwtToken(data){
    const privateKey = file.readFileSync(`${__dirname}/keys/`)
}

module.exports = {hasPermission, Authorize}