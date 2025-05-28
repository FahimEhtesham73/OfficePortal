module.exports = (error, req, res, next) =>{
    if(error){
        console.log(error);
        return res.status(500).json({"message": "Something went wrong"})
    }
    if (req.headersSent){
        res.status(500).json({"message": "Server Error"});
    }
    else{
        next(error);
    }
}