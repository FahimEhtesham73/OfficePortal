
const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.createUser = async(req, res)=> {
    try{

        const {username, password, role} = req.body;
        const user = await User.findOne(username);
        if(user) req.status(400).json("userid already exist");
    
        const data = {
            username: username,
            password: password,
            role: role
        }
        const result = await new User(data);
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json("wrong in create user");
    }
}

module.exports.signinUser = async(req, res)=> {
    const {username, password} = req.body;

    if(username && password){
        const user = await User.findOne({username: username}).lean();
        if(!user) return res.status(400).json("wrong credential");
        if(!user.password === password) return res.status(400).json("wrong credential");
        const token = jwt.sign({
            username,
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