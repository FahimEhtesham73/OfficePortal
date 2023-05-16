const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser,searchUser, profileImgUpload, fileUpload, viewCv, viewImage } = require("../controllers/userController");
const { hasPermission,Authorize } = require("../middleware/commonMilddleware");
const { createEmployeeValidation, signinValidation, signinDataValidation,searchEmployeeValidation, updateSingleUserValidation } = require("../util/validator/userValidation");

router.route("/getalluser").get(Authorize,allUser); // get all user
router.route("/create").post(Authorize,hasPermission, createEmployeeValidation, createUser); // create a user
router.route("/signin").post(signinDataValidation ,signinUser);
router.route("/getsingleuser/:id").get(Authorize,getSingleUser)
router.route("/updateUser/:id").put(Authorize,updateSingleUserValidation,updateSingleUser)
router.route("/searchuser").post(Authorize,searchEmployeeValidation,searchUser)
// router.route("/delete").delete(deleteSingleUser);
router.route("/imgupload").post(profileImgUpload)
router.route("/viewcv").post(viewCv)

//stroge location selection
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        console.log("original name",file.originalname);
    let folder;
    if(req.body.type === "img"){
        folder = "images"
    }else if (req.body.type === "cv"){
        folder = "cv"
    }
       const userId = req.body.userId;
        const uniqueFolder = path.join(process.env.FILESTORAGE, folder,userId).normalize();
            fs.rmdir(uniqueFolder, {recursive: true}, err => {
                if(err) throw err
                else{

                    fs.mkdir(uniqueFolder, async(err)=> {
                        if(!err){
                            req.userPath = path.join(uniqueFolder, file.originalname)
                            cb(null, uniqueFolder);
                        }else{
                            console.log(err);
                        }
                    })
                }
            })
  
    },
    filename: (req, file, cb)=> {
        cb(null, file.originalname)
    }
    
})

//upload funtionality
const upload = multer({
    storage: storage,
    fileFilter: (req, files, callback)=>{
        const ext = path.extname(files.originalname.trim());
        const allowed = ['.png', '.jpg', '.jpeg', '.pdf'];
        if (allowed.includes(ext)) {
          callback(null, true);
        } else {
          callback(null, false); // handle error in middleware, not here
        }
      },
      
}).single("file")
router.route("/fileupload").post(Authorize, upload, fileUpload);

router.route("/images").get(viewImage)

module.exports = router;