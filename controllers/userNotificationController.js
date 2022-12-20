
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userNotification = require("../models/userNotification");
const Notifications = require("../models/Notifications");



exports.createNotification = catchAsyncErrors(async (req, res, next) => {
    const { FlatNo, NotificationTitle, NotificationDesc } = req.body;
    const user1 = await userNotification.find({ FlatNo: FlatNo, NotificationDesc: NotificationDesc, NotificationTitle: NotificationTitle });
    if (user1 && Object.keys(user1).length) {
        res.status(201).json({
            success: false,
            message: "failure"
        })
    }
    else {
        const notification = await userNotification.create({
            FlatNo: FlatNo,
            NotificationTitle: NotificationTitle, 
            NotificationDesc: NotificationDesc,
        })
        res.status(201).json({
            success: true,
            message: "success"
        });
    }
});

// // login User
// exports.loginUser = catchAsyncErrors(async (req, res, next) => {
//     const { FlatNo, Password } = req.body;
//     const user = await User.find({ FlatNo: FlatNo, Password: Password })
//     if (!user && Object.keys(user).length) {
//         return next(new ErrorHandler("User does not exists", 404));
//     }
//     console.log(req);
//     // sendToken(user, 201, res);
//     res.status(200).json({
//         success: true,
//         user
//     });
// })


exports.getUserNotifications = catchAsyncErrors(async(req,res,next) => {
   
    const userNotifications = await userNotification.find({FlatNo: req.query.FlatNo}).sort({"Time": -1});
    
    res.status(200).json({
        success:true,
        userNotifications
    })
});
exports.getAllUserNotifications = catchAsyncErrors(async (req, res) => {

    const data = await userNotification.find().sort({"Time": -1})
    const userNotifications = data.map((ele) => {

        return (
            {
                
                FlatNo: ele.FlatNo,
                NotificationDesc: ele.NotificationDesc, 
                NotificationTitle: ele.NotificationTitle, 
                Flag: ele.Flag,
                Time: ele.Time
            }
        );
    })
    res.status(200).json({
        success: true,
        userNotifications
    });

})

exports.updateNotification = catchAsyncErrors(async(req,res,next)=> {
    // console.log("entered");
    let notification1 = await userNotification.findById(req.query.item._id);
    if(!notification1){
        return next(new ErrorHandler("complaint not found",404));
    }
    notification1.Flag = req.query.item.Flag;
    notification1.NotificationDesc = req.query.item.NotificationDesc;
    notification1.NotificationTitle = req.query.item.NotificationTitle;
    
    notification1.save();
    // console.log("success");
    // complaint1 = await Complaint.find({FlatNo: req.query.complaint.FlatNo, Issue: req.query.complaint.Issue, Description: req.query.complaint.Description});
    res.status(200).json({
        success: true,
        message: "SuccessFully updated"
    })
});

exports.deleteNotification = catchAsyncErrors(async(req,res,next) => {
    const notification1 = await userNotification.findById(req.query.item._id);
    if(!notification1) {
        return next(new ErrorHandler("notification not found",404));
    }
    
    await notification1.remove();
    res.status(200).json({
        success: true,
        message: "notification Deletion successful"
    })
});