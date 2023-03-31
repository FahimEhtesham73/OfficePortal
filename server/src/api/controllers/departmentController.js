const Dept = require("../models/departmentModel");

module.exports.getAllDept = async(req, res)=> {
    try{
        const allDept = await Dept.find().select({name: 1, alias: 1}).lean();
        return res.status(200).json({"roles": allDept})
    }catch(err){
        return res.status(500).json({"message": "Something Went Wrong"})
    }
}