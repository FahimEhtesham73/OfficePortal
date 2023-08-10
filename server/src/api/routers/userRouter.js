const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { createUser, deleteSingleUser, allUser, signinUser, getSingleUser,updateSingleUser,searchUser, profileImgUpload, fileUpload, viewCv, viewImage, getUserUnderSuperVisorOrTemlead, passwordReset, resetConfirmation } = require("../controllers/userController");
const { hasPermission,Authorize, isAdminTeamLeadProjectLead, isAdmin } = require("../middleware/commonMilddleware");
const { createEmployeeValidation, signinValidation, signinDataValidation,searchEmployeeValidation, updateSingleUserValidation, resetPasswordValidation, changePasswordValidation } = require("../util/validator/userValidation");

router.route("/getalluser").get(Authorize,allUser); // get all user
router.route("/create").post(Authorize,isAdmin, createEmployeeValidation, createUser); // create a user
router.route("/signin").post(signinDataValidation ,signinUser);
router.route("/getsingleuser/:id").get(Authorize,getSingleUser)
router.route("/updateUser/:id").put(Authorize,updateSingleUserValidation,updateSingleUser)
router.route("/searchuser").post(Authorize,searchEmployeeValidation,searchUser)
// router.route("/delete").delete(deleteSingleUser);
router.route("/imgupload").post(Authorize,profileImgUpload)
router.route("/viewcv").post(Authorize, viewCv)
router.route("/userlist").get(Authorize, isAdminTeamLeadProjectLead,  getUserUnderSuperVisorOrTemlead);
router.route("/resetpassword").post(resetPasswordValidation, passwordReset);
router.route("/passwordchange").post(changePasswordValidation,resetConfirmation);


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
    let folder;
    if(req.body.type === "img"){
        folder = "images"
    }else if (req.body.type === "cv"){
        folder = "cv"
    }
       const userId = req.body.userId;
        const uniqueFolder = path.join(process.env.FILESTORAGE, folder, userId).normalize();
        const isFolderExist = fs.existsSync(uniqueFolder);
        console.log(isFolderExist);
        if(isFolderExist){
            fs.rmdir(uniqueFolder, {recursive: true}, err => {
                if(err) {
                    console.log(err);
                    throw err}
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
        }
        else{
            // fs.rmdir(uniqueFolder, {recursive: true}, err => {
            //     if(err) throw err
            //     else{

                    fs.mkdir(uniqueFolder, async(err)=> {
                        if(!err){
                            req.userPath = path.join(uniqueFolder, file.originalname)
                            cb(null, uniqueFolder);
                        }else{
                            console.log(err);
                        }
                    })
                }
            // })
  
    },
    filename: (req, file, cb)=> {
        cb(null, file.originalname)
    }
    
})

//upload funtionality
const upload = multer({
    limits: {
        fileSize: 1048576 //10mb
    },
    storage: storage,
    fileFilter: (req, files, callback)=>{
        const ext = path.extname(files.originalname.trim());
        const allowed = ['.png', '.jpg', '.jpeg', '.pdf'];
        const imgType = ['.png', '.jpg', '.jpeg']
        if (allowed.includes(ext)) {
            if(req.body.type === "img" && !imgType.includes(ext)){
            req.fileValidationError = 'invalid image format'; 
            callback(null, false); 

            }
            if(req.body.type === "cv" && ext !== ".pdf"){
                req.fileValidationError = 'invalid pdf format'; 
                    callback(null, false); 

                }
          callback(null, true);
        } else {
            req.fileValidationError = 'invalid file format';
            callback(null, false); 
            // handle error in middleware, not here
            // throw new Error("Invalid image or pdf format")
        }
      },
      
}).single("file")
router.route("/fileupload").post(Authorize, upload, fileUpload);

router.route("/images").get(viewImage)

module.exports = router;