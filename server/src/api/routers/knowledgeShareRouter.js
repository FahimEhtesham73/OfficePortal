const { 
  createKnowLedgeShare, 
  fileUploadForKnowLedgeShare, 
  videoStream, 
  getSingleKnowledgeShareInfos, 
  updateKnowledgeShareData, 
  deleteKnowledgeShareData,
  filterVideoBlogData,
  createKnowledgeCategory,
  getKnowledgeCategory,
  deleteFile,
  downloadAttachments
} = require("../controllers/knowledgeShareingController");
const {Authorize} = require("../middleware/commonMilddleware");
const router = require("express").Router();
const multer = require("multer")
const path = require("path");
const customMulterUpload = require("../middleware/customFileUploader");
const { 
  createVideoKnowledgeValidator, 
  fileUplaodValidator, 
  getSingleKnowledgeValidator, 
  updateSingleKnowledgeValidator
 } = require("../util/validator/knowledgeShareValidator");

    
router.route("/createvideoblog").post(Authorize, createVideoKnowledgeValidator,createKnowLedgeShare);
router.route("/fileupload").post( Authorize,
  customMulterUpload("videos", "files"),
  fileUploadForKnowLedgeShare
  )

router.route("/video").post(videoStream);
router.route("/filter").post(Authorize, filterVideoBlogData);
router.route("/category")
            .get(Authorize, getKnowledgeCategory)
            .post(Authorize, createKnowledgeCategory);

router.route("/deleteFile").post(Authorize, deleteFile)


router.route("/knowledge/:knowledgeShareId")
            .get(Authorize, getSingleKnowledgeValidator, getSingleKnowledgeShareInfos)
            .put(Authorize,getSingleKnowledgeValidator, updateSingleKnowledgeValidator, updateKnowledgeShareData)
            .delete(Authorize, getSingleKnowledgeValidator, deleteKnowledgeShareData)


router.route("/downloadfile/:fileId").get(downloadAttachments)

module.exports = router;
