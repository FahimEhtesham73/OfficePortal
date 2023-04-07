const Designation = require("../models/designationModel");

module.exports.getAllDesignation = async(req, res)=> {
    try{
        const allDesignation = await Designation.find().select({name:1}).lean();
        return res.status(200).json({"roles": allDesignation})
    }catch(err){
        return res.status(500).json({"message": "Something Went Wrong"})
    }
}
