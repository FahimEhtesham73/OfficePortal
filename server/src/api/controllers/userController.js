
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const jwt = require("jsonwebtoken");

module.exports.createUser = async(req, res)=> {
    try{

        const {email, password, role, name} = req.body;
        const user = await User.findOne({email: email});
        if(user) return res.status(400).json("userid already exist");
    
        const userData = {email, password, role}
        const userInfo = await new User(userData).save();
        

        const employeeData = {name, userId: userInfo._id };
        const result = await new Employee(employeeData).save();
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json("wrong in create user");
    }
}

module.exports.signinUser = async(req, res)=> {
    const {email, password} = req.body;

    if(email && password){
        const user = await User.findOne({email: email}).lean();
        if(!user) return res.status(400).json("wrong credential");
        if(!user.password === password) return res.status(400).json("wrong credential");
        const token = jwt.sign({
            
            id: user._id,
            role: user.role
        },'SECRET', {expiresIn: "7d"});
        return res.status(200).json({"token": token , "message": "successfully login"}); 
    }else{
        return res.status(401).json("userid and password needed")
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