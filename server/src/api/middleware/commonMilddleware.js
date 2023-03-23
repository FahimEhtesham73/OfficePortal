const { default: mongoose } = require("mongoose");
const RolePermission = require("../models/rolePermissionModel");
const User = require("../models/userModel");

async function hasPermission(req, res, next){
    const userInformation = {
        email: "shuvo@nextsolutionlab.com",
        role: "641bc3cf13941c75c3a35db0"
    }
    const user = await User.findOne({email: userInformation.email}).lean();
    const urlsss = req.originalUrl;
    const permission = await RolePermission.findOne({name: urlsss}).lean();
    // console.log(permission);
    console.log(permission.roles.includes(user.role.toString()) );
    if(permission?.roles.includes(user?.role.toString())){
        next();
    }else{
        return res.status(404).json({"message": "forbidden"})
    }
    
    // if(userInformation.role)
}

module.exports = {hasPermission}