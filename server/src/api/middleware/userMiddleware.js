const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.Authorize = async(req, res, next)=>{
    try {
        let token = req.header("Authorization");
        token = token.split(" ")[1].trim();
        const decode = await jwt.verify(token, 'SECRET');
        req.user = decode;
        next();
    }
    catch(e){
        // console.log(e);
        res.status(401).json({"message": "Authorization failed"});
    }
}
