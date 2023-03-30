module.exports = (error, req, res, next) =>{
    if (req.headersSent){
        res.status(500).json({"message": "Server Error"});
    }
    else{
        next(error);
    }
}