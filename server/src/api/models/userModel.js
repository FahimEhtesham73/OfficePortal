const {Schema, model} = require("mongoose")
const UserSchema = new Schema({
    email: String,
    password: String,
    role: {type: Schema.Types.ObjectId, ref: "Role"},
    lastLogin: Date,
    lastPasswordChanged:Date,
    isPermissionChanged:Boolean,
    isActive: Boolean,
    isMFAEnabled:Boolean,
    isEmailVerified: Boolean,
    empId:String,
    firstName: String,
    middleName: String,
    lastName: String,
    nickName: String,
    nid: String,
    gender: String,
    designation: String,
    department: {type: Schema.Types.ObjectId, ref: "Department"},
    education:[{schoolOrCollege: String, location:String, endYear: Date, startYear:Date, degree:String }],
    personalPhone: String,
    alternatePhone: String,
    bloodGroup: String,
    joiningDate: String,
    prevWorkPlace: [{company: String, location: String, title:String, startYear: Date, endYear: Date }],
    address: [{houseNo: String, roadNo: String, city: String, district: String, country:String, AddressType: String, }], // addressType: "present/permanent"
    maritaialStatus: String,
    imagePath: {type: String, default: "https://cdn-icons-png.flaticon.com/512/21/21104.png" },
    createdBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"}
},{timestamps: true});

// UserSchema.cre({"empId": 1})

module.exports = model("User", UserSchema);