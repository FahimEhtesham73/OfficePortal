const {Schema, model, default: mongoose} = require("mongoose")
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
    birthDate:Date,
    nid: String,
    gender: String,
    isActive:{type: Boolean, default:true},
    isSuperAdmin: {type: Boolean, default: false},
    designation: {type: Schema.Types.ObjectId, ref: "Designation"},
    department: {type: Schema.Types.ObjectId, ref: "Department"},
    educations:[{institution: String, location:String, endYear: Date, startYear:Date, degree:String }],
    personalPhone: String,
    alternatePhone: String,
    bloodGroup: String,
    joiningDate: Date,
    experinces: [{company: String, location: String, title:String, startYear: Date, endYear: Date, contribution: String }],
    // expertises:[{skillName: String, skillType: String, level: Boolean}],
    goals: [{goalName: String, goalType: String}],
    skills: [{title: String, tools:String}],
    officeTimeSlot: {
        type: String,
        enum: ["9:00 AM", "11:00 AM", "2:00 PM"],
        default: "9:00 AM"
    },
    address: [{houseNo: String, roadNo: String, city: String, district: String, country:String, AddressType: String, }], // addressType: "present/permanent"
    maritalStatus: String,
    nationality:String,
    religion:String,
    imagePath: {type: String, default: "https://cdn-icons-png.flaticon.com/512/21/21104.png" },
    cvPath: {type: String},
    isProfileUpdate: {type: Boolean},
    createdBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"},
    updatedBy: {type: Schema.Types.ObjectId,  default: "000000000000000000000000"},
},{timestamps: true});

// UserSchema.cre({"empId": 1})

module.exports = model("User", UserSchema);