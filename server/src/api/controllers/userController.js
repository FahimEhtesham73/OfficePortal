
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Module = require("../models/moduleModel");
const Permission = require("../models/rolePermissionModel");
const Department = require("../models/departmentModel")
const Designation = require("../models/designationModel")
// const SubModule = require("../models/subModule");

const { verifyHash, tokenGeneration, hashPasswordGenarator } = require("../services/userServices");


module.exports.createUser = async(req, res)=> {
    try{

        const {firstName, lastName, email, password, designation, role, department } = req.body;
        const user = await User.findOne({email: email});
        if(user) return res.status(400).json("Employee already exist");
    
        const hashPassword = await hashPasswordGenarator(password)
        const userData = {firstName, lastName, email, password: hashPassword, designation, role, department}
        
        const result = await new User(userData).save();
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json("wrong in create user");
    }
}

module.exports.signinUser = async(req, res)=> {
    try{
        const {email, password} = req.body;

            const user = await User.findOne({email: email}).populate("role", "title", "Role")
                .populate("designation", "name")
                .populate("department", "name").lean();
            if(!user) return res.status(400).json("wrong credential");
            let isValid = await verifyHash(password, user.password)
            if(!isValid) return res.status(400).json("wrong credential");
            const userTokenData = {
                "_id": user._id,
                "role": user.role,
            };
            const resourceInformation = {

            }
            const {password: p, createdAt, createdBy, updatedAt, updatedBy, ...restUserInformation} = user;
            const token = tokenGeneration(userTokenData);
            const cookie = `_token=${token};samesite=strict; secure;path=/; httpOnly`
            // res.cookie("_token", cookie, { expires: new Date(Date.now() + 43200*1000)});
            res.setHeader("Set-Cookie", [cookie])

            return res.status(200).json({"userInformation": restUserInformation, "resourceInformation": resourceInformation, "message": "successfully login"}); 
    }catch(err){
        console.log(err);
        return res.status(500).json({"message": "Something went wrong"})
    }
    
}

module.exports.deleteSingleUser = async(req, res)=> {
    const {userid} = req.body;
    const user = await User.findOne(userid);
    if(!user) return res.status(400).json("user not found");
    await User.findOneAndDelete(userid);
    return res.status(200).json("successfully deleted");

}

module.exports.allUser = async(req, res)=> {
    try{
        const users = await User.find().lean();

    }catch(e){
        console.log(e);
        return res.status(500).json("something went wrong on all user get function")
    }
}