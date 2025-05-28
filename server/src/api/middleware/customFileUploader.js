// customMulterUpload.js
const multer = require('multer');
const path = require("path")
const fs = require("fs");
const crypto = require("node:crypto");
const { knowledgeCategoryList } = require('../services/knowledgeServices');


const allowedVideoTypes = [
  "video/mp4",
  "video/avi",
  "video/mkv",
  "video/mov",
  "video/wmv",
  "video/flv",
  "video/webm",
  "video/mpeg",
];

const allowedOtherLinksType = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];


const allowedThumbnailTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg"

]
// Custom middleware function to handle file upload with custom destination
/**
 * 
 * @param {String} destination 
 * @param {string} fieldName 
 * @returns 
 */
// const timeString =(time)=> crypto.createHash('md5').update(time, "utf8").digest("hex")
const customMulterUpload = (destination, fieldName) => {
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const knowledgeCategory = req.body.knowledgeCategory;
      if (!req.body.knowledgeCategory && req.body.filetype ) {
        cb(null, process.env.FILESTORAGE+'/othersfiles')
      }

        let directory = knowledgeCategory? path.join(process.env.FILESTORAGE,destination,req.body.knowledgeCategory.trim()): path.join(process.env.FILESTORAGE, "/othersfiles");
          if(knowledgeCategory === "general"){
            const isDirectoryFound = fs.existsSync(directory)
            if (!isDirectoryFound) {
              fs.mkdirSync(directory, { recursive: true });
            }
          }
          
          // if course
          else if(knowledgeCategory === "course"){
            const isDirectoryFound = fs.existsSync(directory)
            if (!isDirectoryFound) {
              fs.mkdirSync(directory, { recursive: true });
            }
          }
            // if management
            else if(knowledgeCategory === "management"){
              const isDirectoryFound = fs.existsSync(directory)
              if (!isDirectoryFound) {
                fs.mkdirSync(directory, { recursive: true });
              }
            }

        cb(null, directory);
      // } 
      
      // else {
      //   cb(null, path.join(process.env.FILESTORAGE, "othersfiles") );
      // }
    },
    filename: function (req, file, cb) {
      // Define filename
      const fileName = req.body.timestamps+ "_" + req.user._id + "_" + file.originalname;
      cb(null, fileName);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, files, cb) => {
      if (files.mimetype) {
        const fileName = req.body.timestamps+ "_" + req.user._id + "_" + files.originalname;

        // if(req.body.filetype === "thumbnail" && allowedThumbnailTypes.includes(files.mimetype)){
        //   req.filePath = path.join(process.env.FILESTORAGE, "othersfiles", files.originalname)
        //   req.filetype = files.mimetype;

        //     cb(null, true)
        //   return

        // }
        // if(!req.body.knowledgeCategory && req.body.type === "others" && allowedOtherLinksType.includes(files.mimetype)){
        //   req.filePath = path.join(process.env.FILESTORAGE, "othersfiles", files.originalname)
        //   req.filetype = files.mimetype;

        //     cb(null, true)
        //   return

        // }
        if(req.body.filetype === "thumbnail" && allowedThumbnailTypes.includes(files.mimetype)){
          req.filePath = path.join(process.env.FILESTORAGE, "othersfiles", fileName);
          req.filetype = files.mimetype;
          cb(null, true)
          return
        }
        if(req.body.filetype === "others" && allowedOtherLinksType.includes(files.mimetype)){
          req.filePath = path.join(process.env.FILESTORAGE, "othersfiles", fileName);
          req.filetype = files.mimetype;
          cb(null, true)
          return
        }
        if (allowedVideoTypes.includes(files.mimetype) && knowledgeCategoryList.includes(req.body.knowledgeCategory)) {
         
          if(req.body.knowledgeCategory === "general"){
            req.filePath = path.join(process.env.FILESTORAGE, destination, req.body.knowledgeCategory.trim(), fileName);
            req.filetype = files.mimetype;
            cb(null, true)
            return
          }
          if(req.body.knowledgeCategory === "course"){
            req.filePath = path.join(process.env.FILESTORAGE, destination, req.body.knowledgeCategory.trim(), fileName);
            req.filetype = files.mimetype;
            cb(null, true)
            return

          }
          if(req.body.knowledgeCategory === "management"){
            req.filePath = path.join(process.env.FILESTORAGE, destination, req.body.knowledgeCategory.trim(), fileName);
            req.filetype = files.mimetype;
            cb(null, true)
            return

          }
         
          // req.filePath = path.join(directory, files.originalname)
        } else {
          req.fileValidationError = 'Invalid file format';
          cb(null, false);

        }

      }
    }
  });

  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A multer error occurred
        return res.status(400).send({ error: 'Multer error occurred', message: err.message });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).send({ error: 'Unknown error occurred', message: err.message });
      }
      // No error, move to next middleware
      next();
    });
  };
};

module.exports = customMulterUpload;