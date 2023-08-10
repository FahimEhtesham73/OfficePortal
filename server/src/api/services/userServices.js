const fs = require("node:fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("node:path");
const Session = require("../models/sessionModel");

/**
 * 
 * @param {string} password - User's password
 * @returns {string} Return a hash string
 */
module.exports.hashPasswordGenarator = async (password)=> {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword
}
/**
 * 
 * @param {string} password 
 * @param {string} hashpassword 
 * @returns {boolean} 
 */

module.exports.verifyHash = async (password, hashpassword) => {
    const verifyHash = await bcrypt.compare(password, hashpassword);
    return verifyHash;
}

/**
 * 
 * @param {object} userData - Contains user information
 * @returns {string} - jwt token  
 */
module.exports.tokenGeneration =  (userData, expiresIn="12h") => {
    const privateKey = fs.readFileSync(path.join(`${__dirname}/../../../`, "keys", "private.key"));
    let i  = 'NSL';          // Issuer 
    let s  = 'query@nextsolutionlab.com';   // Subject 
    let a  = 'https://nextsolutionlab.com'; // Audience

    const signOptions = {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn:  expiresIn,
        algorithm:  "RS256"
       };

    const token =  jwt.sign(userData, privateKey, signOptions);
    return token
}

/**
 * 
 * @param {string} token - Token
 * @returns {boolean} -Return a boolean value  
 */
module.exports.verifyToken =  (token) => {
    var isVerified;
    try{
        const publicKey = fs.readFileSync(path.join(`${__dirname}/../../../`, "keys", "public.key"));
        let i  = 'NSL';          // Issuer 
        let s  = 'query@nextsolutionlab.com';        // Subject 
        let a  = 'https://nextsolutionlab.com'; // Audience
    
        const signOptions = {
            issuer:  i,
            subject:  s,
            audience:  a,
            expiresIn:  "12h",
            algorithm:  "RS256"
           };
    
        const isVerified =  jwt.verify(token, publicKey, signOptions);
        return isVerified;

    }catch(err){
        return false
    }

}



/**
 * @param {string} userId
 * @param {object} userData
 */
module.exports.createSession = async (userId, sessionData)=> {
    const isSessionAvialble = await Session.findOne({userId: userId});
    
    let createNewSession;
    if(!isSessionAvialble) {
        createNewSession = await new Session({userId, ...sessionData}).save()
    } 
    
    await Session.findOneAndUpdate({userId: userId}, {userId: userId, ...sessionData});
    

    return isSessionAvialble? isSessionAvialble._id : createNewSession._id;
}
