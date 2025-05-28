const fs = require("fs");
const util = require("util");
const { default: mongoose, mongo } = require("mongoose");
const User = require("../models/userModel");
const Kshare = require("../models/knowledgeShare/knowledgeShareing");
const { validationResult } = require("express-validator");
const { validationMessages, isErrorFounds } = require("../util/errorMessageHelper");
const { thumbnailMapping } = require("../services/knowledgeServices");
const fileMetadata = require("../models/knowledgeShare/KnowledgeShareMetadata");
const KCategory = require("../models/knowledgeShare/knowledgeCategory");


/**

req input 
author:{"name": "Shuvo","oId": 222222}
title:Full stack learning
categories:[{"name": "AI","oId": "222222"}]
knowledgeType:video
knowledgeCategory:general

 */
module.exports.createKnowLedgeShare = async (req, res) => {
  try {

    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Invalid request" });


    const { author, title, knowledgeType, knowledgeCategory, categories, description } = req.body;

    if(knowledgeType === "video"){
      //get mapping link for thumbnail;
      const thumbailLinks = req.body.thumbnailpath ? req.body.thumbnailpath : thumbnailMapping[knowledgeType]
  
      const isNewShare = await Kshare.findOne({ title: title });
      console.log(isNewShare);
      if (isNewShare) {
        return res.status(400).json({ "message": "Title already in use" });
      }
      const newShare = await new Kshare({
        author: author,
        title,
        knowledgeType,
        knowledgeCategory,
        thumbailLinks,
        categories,
        thumbailLinks,
        description,
        createdBy: req.user?._id ? req.user._id : "000000000000000000000000",
        updatedBy: req.user?._id ? req.user._id : "000000000000000000000000"
  
      }).save()
  
      const kMetadata = await new fileMetadata({
        knowledgeShareId: newShare._id,
        link: req.body.filePath ? req.body.filePath : "",
        priority: "primary",
        fileType: req.body.fileType,
        createdBy: req.user._id,
        updatedBy: req.user._id
      }).save()
  
  
      return res.status(200).json({ "message": "Created Successfully", result: newShare })

    }else{
        //get mapping link for thumbnail;
        const thumbailLinks = req.body.thumbnailpath ? req.body.thumbnailpath : thumbnailMapping[knowledgeType]
  
        const isNewShare = await Kshare.findOne({ title: title });
        console.log(isNewShare);
        if (isNewShare) {
          return res.status(400).json({ "message": "Title already in use" });
        }
        const newShare = await new Kshare({
          author: author,
          title,
          knowledgeType,
          knowledgeCategory,
          thumbailLinks,
          categories,
          thumbailLinks,
          description,
          createdBy: req.user?._id ? req.user._id : "000000000000000000000000",
          updatedBy: req.user?._id ? req.user._id : "000000000000000000000000"
    
        }).save()
    
        // const kMetadata = await new fileMetadata({
        //   knowledgeShareId: newShare._id,
        //   link: req.body.filePath ? req.body.filePath : "",
        //   priority: "primary",
        //   fileType: req.body.fileType,
        //   createdBy: req.user._id,
        //   updatedBy: req.user._id
        // }).save()
    
    
        return res.status(200).json({ "message": "Created Successfully", result: newShare })
    }


  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


module.exports.fileUploadForKnowLedgeShare = async (req, res) => {
  const erros = validationMessages(validationResult(req).mapped());
  // if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros });
  // const allowedTypes = ['general', 'management', 'course'];
  // if(allowedTypes.includes(req.body.knowledgeCategory)) 
  console.log(req.body);
  if (req.fileValidationError) return res.status(400).json({ "message": req.fileValidationError });
  const filePath = req.filePath;
  const fileType = req.filetype;


  return res.status(200).json({ "message": "success", result: { filepath: filePath, fileType: fileType } })
}

//get general user video
//get hr management video
//get course video
// getVideo

//get course
//upload course
// modify course content


module.exports.videoStream = async (req, res) => {
  /*
      // Ensure there is a range given for the video
    // const knowledgeId = await 
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath = "/home/nsl52/SHUVO/projects/nsl_system/code/Leave_Management_System/server/assets/videos/course/SampleVideo_1280x720_1mb.mp4";
  const videoSize =  fs.statSync(videoPath).size;

  console.log("video size", videoSize);
  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res)

  */

  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Invalid request" });
    const kn = await fileMetadata.find({ knowledgeShareId: req.body.knowledgeShareId, priority: req.body.priority });
    const videoUrl = kn[0]?.link;
    const splitingUrl = videoUrl.split("/");
    const url = "http://localhost:5001" + `/videos` + `/${splitingUrl[splitingUrl.length - 2]}` + `/${splitingUrl[splitingUrl.length - 1]}`
    return res.status(200).json({ "message": "Success", result: url })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }


  // const linkGenration =  
}


// get single knowledge share 
module.exports.getSingleKnowledgeShareInfos = async (req, res) => {
  try {

    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Unsuccess" });

    const { knowledgeShareId } = req.params;
    const isController = true;
    const knowledge = isController ? await Kshare.findOne({ _id: knowledgeShareId }) : await Kshare.findOne({ _id: knowledgeShareId, isActive: true });
    if (!knowledge) return res.status(404).json({ "message": "No data found" });

    const allFiles = await fileMetadata.find({ knowledgeShareId }).lean();

    return res.status(200).json({
      "message": "Success", result: {
        "knowledge": knowledge, "allFiles": allFiles
      }
    })
  } catch (err) {
    console.log("from get singleknowledge share infos" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}



//update knowledge share
/**
 * 
 * input data
{
"author":{"name": "Shuvo","oId": "222222"},
"title":"Full stack learning 1",
"categories":[{"name": "AI","oId": "222222"}, {"name": "AI","oId": "222222"}],
"filePath": "/home/nsl52/SHUVO/projects/nsl_system/code/Leave_Management_System/server/assets/videos/general/video_part1.mp4",
"thumbnailpath" : "/path/user/shuvo"
}
 */
module.exports.updateKnowledgeShareData = async (req, res) => {
  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Unsuccess" });
    const { knowledgeShareId } = req.params;
    // const knowledge = isController? await Kshare.findOne({_id: knowledgeShareId}) : await Kshare.findOne({_id: knowledgeShareId, isActive: true});
    const knowledge = await Kshare.findOne({ _id: knowledgeShareId })
    if (!knowledge) return res.status(404).json({ "message": "No data found" });
    const { title, author, knowledgeCategory, thumbnailpath, categories, description, isActive, command } = req.body;
    if(command === "newAttachment"){
      await new fileMetadata({
        knowledgeShareId,
        link: req.body.newFilePath,
        priority: "others",
        fileType: req.body.newFileType,
        createdBy: req.user._id,
        updatedBy: req.user._id
      }).save();

      return res.status(200).json({
        "message": "success",
      })
    }
    if (knowledge.title !== title) {
      const isTitleAlreadyUsed = await Kshare.findOne({ title: title }).lean();
      if (isTitleAlreadyUsed) return res.status(400).json({ "message": "Unsuccess", "errors": "title already used, try different title" });

    }
    const updatedData = await Kshare.findOneAndUpdate({ _id: knowledgeShareId }, {
      $set: {
        title, author, knowledgeCategory, thumbailLinks: thumbnailpath, categories, description, isActive,
      }
    });
    if (req.body.newFilePath) {
      await new fileMetadata({
        knowledgeShareId,
        link: req.body.newFilePath,
        priority: "others",
        fileType: req.body.newFileType,
        createdBy: req.user._id,
        updatedBy: req.user._id
      }).save()
    }

    if (req.filePath) {
      await fileMetadata.findOneAndUpdate({ knowledgeShareId }, {
        $set: {
          link: req.body.filePath,
        }
      })
    }


    return res.status(200).json({
      "message": "success", result: {
        updatedData
      }
    })




  } catch (err) {
    console.log("from update singleknowledge share infos" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


//delete knowledge share
module.exports.deleteKnowledgeShareData = async (req, res) => {
  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Unsuccess" });
    const { knowledgeShareId } = req.params;
    const knowledge = await Kshare.findOne({ _id: knowledgeShareId })

    if (!knowledge) return res.status(400).json({ "message": 'Unsuccess', "errors": "Data not found" })
    await Kshare.findOneAndDelete({ _id: knowledgeShareId });
    const fileLinks = await fileMetadata.find({ knowledgeShareId });
    let fileLinksdata = [...fileLinks.map(v => v.link), knowledge.thumbailLinks];
    const unlink = util.promisify(fs.unlink);
    for (let f of fileLinksdata) {
      try {
        await unlink(f)
      } catch (err) {
        continue
      }

    }

    return res.status(200).json({ "message": "Success" })
  } catch (err) {
    console.log("from delete singleknowledge share infos" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}

/**
 * request parmeter
{
"filter": {
"knowledgeType":"",
"knowledgeCategory":"general",
"categories":["Ai", "Web", "Testing"]
    },
"page": 1,
"limit": 2
}
 */
// get all file and filter data
module.exports.filterVideoBlogData = async (req, res) => {
  try {
    const erros = validationMessages(validationResult(req).mapped());
    if (isErrorFounds(erros)) return res.status(400).json({ "errors": erros, message: "Unsuccess" });

    const body = req.body.filter;
    const limit = parseInt(req.body.limit) || 10;
    const page = parseInt(req.body.page) || 1;
    const sortOrder = req.body.sortOrder ? req.body.sortOrder : 1;
    const sortBy = req.body.sortBy ? req.body.sortBy : "title";

    const filter = {}

    for (let key in body) {
      if (key === "knowledgeType" && body['knowledgeType']) {
        filter['knowledgeType'] = body[key]
      }
      if (key === "categories") {
        filter[`${key}.name`] = { $in: body[key] }
      }
      if (key === "isActive" && body['isActive']) {
        filter['isActive'] = body[key]
      }
      if (key === "isActive" && body['isActive']) {
        filter['isActive'] = body[key]
      }
      // filter[key] = body[key]
    }
    console.log(JSON.stringify(filter));
    const data = await Kshare.aggregate([
      //matching 
      {
        $match: {
          ...filter
          // "categories.name": {$in: body.categories}
        }
      }

      // limiting and skipping and sorting
      ,
      {
        $sort: { [sortBy]: sortOrder }
      },
      {
        $limit: limit
      }
    ])
    return res.status(200).json({ "message": "Success", total: data.length, result: data })
  } catch (err) {
    console.log("filter knowledge share data" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


/**
this api for knowledge share thumbnail and other pdf docs upload api
 */
module.exports.uploadOthersFile = async (req, res) => {
  try {

  } catch (err) {
    console.log(err + "from ");
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}

/**
 * this api controller function return knowledge category list
 */
module.exports.getKnowledgeCategory = async (req, res) => {
  try {
    const allCategory = await KCategory.find().select("categoryName")
    return res.status(200).json({ "message": "success", "result": allCategory });
  } catch (err) {
    console.log("createKnowledgeCategory" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


/**
 * this api controller function add knowledge category 
 */

module.exports.createKnowledgeCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    const isAlreadyExist = await KCategory.findOne({ categoryName });
    console.log(isAlreadyExist);
    if (isAlreadyExist) return res.status(400).json({ "message": "Unsuccess", "errors": "Already exist in the category list" });
    await new KCategory({ categoryName: categoryName, createdBy: req.user._id, updatedBy: req.user._id }).save();
    return res.status(200).json({ "message": "success", "result": "Category added successfully" });
  } catch (err) {
    console.log("createKnowledgeCategory" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


/**
 * this api is for deleting file from server local files
 */


module.exports.deleteFile = async (req, res) => {
  try {
    const validType = [".png",
      ".jpg",
      ".jpeg",
      ".mp4",
      ".avi",
      ".mkv",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mpeg",
      ".pdf"]
      let fpath = req.body.filePath;

    if(req.body.fileMetaId){
      const kMetadata = await fileMetadata.findOne({_id: req.body.fileMetaId});
      if(!kMetadata) return res.status(400).json({"message": "File not found"});
      fpath = kMetadata.link;
      await fileMetadata.deleteOne({_id: req.body.fileMetaId});
    }
  
    const pathspiltter = fpath.split("/");
    const lastType = pathspiltter[pathspiltter.length-1];
    console.log(lastType);
    const lastTypeExtSplitter = lastType.split(".")[lastType.split(".").length-1];
    console.log(lastTypeExtSplitter);
    
    if (!validType.includes(lastTypeExtSplitter.toLowerCase()) && `.${lastTypeExtSplitter}`.includes(fpath))  {
      return res.status(400).json({ message: "Invalid file path" })

    }
    
    const isFileAvailable = fs.statSync(fpath);
    if (!isFileAvailable) return res.status(400).json({ "message": "File not found" });

    fs.unlink(fpath, (err) => {
      if (err) {
        return res.status(400).json({ message: "Error in file deleting" })
      }else{
        return res.status(200).json({ message: "Success" })

      }
    })

  } catch (err) {
    console.log("deletefile" + err);
    return res.status(500).json({ message: "Something Went Wrong" })
  }
}


/**
 * this api is for file download
 */

module.exports.downloadAttachments = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileMeta= await fileMetadata.findOne({_id: fileId}).lean();
    if(!fileMeta) return res.status(400).json({"message": "file not found"});
    const filePath = fileMeta.link;
    if (fs.existsSync(filePath)) {
      const fileName = (stringPath) => {
        
        const splitPath = stringPath.split("/");
        const fullName = splitPath[splitPath.length-1];
        const fullNameSpliiter = fullName.split("_");
        console.log("name splitter",fullNameSpliiter);
        return fullNameSpliiter.slice(2, fullNameSpliiter.length).join("_");
      }
      // console.log(fileName);
      const encodedFilename = encodeURIComponent(fileName);
      // console.log(encodedFilename);
      const fileStream = fs.createReadStream(filePath);
      res.setHeader('Content-Type', 'application/octet-stream');  // Generic binary stream
      res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
      fileStream.pipe(res);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}