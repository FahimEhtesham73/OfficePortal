const Role = require("../models/roleModel")

module.exports.getAllRoles = async (req, res) => {
    try{
        const allRoles = await Role.find().select({_id:1, name:1, alias: 1}).lean();
        return res.status(200).json({"roles": allRoles})
    }catch(err){
        return res.status(500).json({"message": "Something Went Wrong"})
    }
}

module.exports.createRole = async(req, res)=> {
    try{
        const {title, alias} = req.body;
        let query = {$or: [{title: title}, {alias: alias}]}
        const isRoleExist = await Role.findOne(query);
        if(isRoleExist) return res.status(400).json({message: "Role already exist"})
        const newRole = await new Role({title, alias, createdBy: req.user._id}).save();
        return res.status(200).json({"data": {title: newRole}, "message": "Role successfully created"})
    }catch(err){
        let msg = process.env.NODE_ENV === "dev" ? err.stack : "Something went wrong"
        return res.status(500).json({"message": msg})
    }
}

module.exports.updateRole =  async(req, res)=> {
    try{
        
    }catch(err){
        let msg = process.env.NODE_ENV === "dev" ? err.stack : "Something went wrong"
        return res.status(500).json({"message": msg})
    }
}