const Role = require("../models/roleModel")

module.exports.getAllRoles = async (req, res) => {
    try{
        const allRoles = await Role.find().select({_id:1, name:1, alias: 1}).lean();
        return res.status(200).json({"roles": allRoles})
    }catch(err){
        return res.status(500).json({"message": "Something Went Wrong"})
    }
}