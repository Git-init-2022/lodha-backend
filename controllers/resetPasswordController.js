const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


// Check If user Exists
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { Email, FlatNo } = req.query;
    let user1 = await User.find({ Email: Email, FlatNo: FlatNo });
    if (!user1) {
        return next(new ErrorHandler("You are not an existing user. Please register", 404));
    }
    
    const resetToken = user1[0].getResetPasswordToken();
    user1[0].save();
    console.log("in Schema : ", user1[0].resetPasswordToken);
    const resetPasswordUrl = `${req.protocol}://localhost:5173/updatepassword/${resetToken}`;
    const message = `Your password reset Link is :- \n\n ${resetPasswordUrl} \n\n Please Note that the link gets deactivated within 15 minutes \n\nIf you have not requested this email then, please ignore it.`;
    console.log(message);
    await sendEmail({
        email: Email,
        subject: "Forgot Password Link",
        message: message
    })
    res.status(200).json({
        success: true,
        message: "Link sent to mail to Update Password"

    })

});

// Update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const resetToken =crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");
      console.log("While Update: ", resetToken);
    const user1 = await User.findOne({
        resetPasswordToken: resetToken, 
        resetPasswordExpire: {$gt : Date.now()}
    })
    console.log("user1: ", user1);
    if (!user1 || user1.length==0) {
        return next(new ErrorHandler("update password is invalid", 201));
    }
    
    user1.Password = req.query.Password;
    user1.resetPasswordToken = undefined;
    user1.resetPasswordExpire = undefined; 
    user1.save();
    res.status(201).json({
        success: true,
        message: "password updation successful"
    })
});