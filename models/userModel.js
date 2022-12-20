const mongoose = require("mongoose")
const crypto =require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({path: '../config/config.env'})
const userSchema = mongoose.Schema({
    OwnerName:{
        type: String,
        required: [true, "Please Enter Owner's Name"],
        trim: true
    },
    RegisteredName: {
        type: String,
        required: [true, "Please Enter Property Registered Name"],
        trim: true
    },
    Email: {
        type:String,
        required: [true, "Please Enter Mail Id"]
    },
    Mobile: {
        type:String,
        required: [true, "Please Enter Phone Number"]
    },
    FlatNo: {
        type: String,
        required: [true, "Please Enter Flat Number"]
    },
    ParkingSlot: {
        type: String,
        required: [true, "Please Enter Parking Slot"]
    },
    Block: {
        type: String,
        required: [true, "Please enter Block Number"]
    },
    Password:{
        type: String,
        required: [true, "Please Enter Password"]
    },
    Role: {
        type: String,
        required: [ true, "Enter role"],
        enum: ['user','admin','fm','itsupport','am'],
        default: 'user'
    },
    Dues: {
        type: Number,
        default: 0,
        required: true
    },
    ImageToken: {
      type: String
    },
    ImageName: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  // JWT TOKEN
  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1 day",
    });
  };
  
  // Compare Password
  
  // userSchema.methods.comparePassword = async function (password) {
  //   return await bcrypt.compare(password, this.password);
  // };
  
  // Generating Password Reset Token
  userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

module.exports = mongoose.model("User", userSchema);