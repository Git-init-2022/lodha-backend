const { Complaint } = require("../models/complaintModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const UserApiFeatures = require("../utils/apifeatures");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'complaints',
    streams: [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        type: 'rotating-file',
        level: 'info',
        path: __dirname+'/logs/complaints.log',
        period: '1m',
        count: 12
    }
    ]
    });

// Create Complaint
exports.createComplaint = catchAsyncErrors(async (req, res, next) => {

    const { Issue, Description, FlatNo} = req.body;
    const complaint1 = await Complaint.find({ Issue: Issue, Description: Description, FlatNo: FlatNo })
    if (complaint1 && Object.keys(complaint1).length) {
        res.status(201).json({
            success: false,
            message: "Complaint already exists"
        });
    }
    else {
        const complaint = await Complaint.create(req.body);


        res.status(201).json({
            success: true,
            complaint
        })
    }
});

// Get All Complaints
exports.getAllComplaints = catchAsyncErrors(async (req, res) => {
    const complaints = await Complaint.find()
    res.status(200).json({
        success: true,
        complaints
    });
});

// Update Complaint
exports.updateComplaint = catchAsyncErrors(async (req, res, next) => {

    let complaint1 = await Complaint.findById(req.query.complaint._id);
    if (!complaint1) {
        return next(new ErrorHandler("complaint not found", 404));
    }
    if (complaint1.Status !== Number(req.query.complaint.Status)) {
        const getUser = await User.find({ FlatNo: complaint1.FlatNo });
        if (!getUser) {
            return;
        }
        log.info(`${req.query.Admin} has changed status of ${complaint1} to done`);
        sendEmail({
            email: getUser[0].Email,
            subject: "Complaint Accepted",
            message: "<h3 style='color: green;'>Your Complaint is Done!</h3>"
        })
    }
    complaint1.Status = req.query.complaint.Status;
    complaint1.Description = req.query.complaint.Description;
    complaint1.save();
    complaint1 = await Complaint.find({ FlatNo: req.query.complaint.FlatNo, Issue: req.query.complaint.Issue, Description: req.query.complaint.Description });
    res.status(200).json({
        success: true,
        message: "SuccessFully updated"
    })
});


// get User Complaints
exports.getUserComplaints = catchAsyncErrors(async (req, res, next) => {

    const complaints = await Complaint.find({ FlatNo: req.query.FlatNo });
    res.status(200).json({
        success: true,
        complaints
    })
});

// Delete User Complaint
exports.deleteComplaint = catchAsyncErrors(async (req, res, next) => {
    const complaint1 = await Complaint.findById(req.query.complaint._id);
    if (!complaint1) {
        return next(new ErrorHandler("complaint not found", 404));
    }
    log.info(`${req.query.Admin} has deleted ${complaint1}`);
    await complaint1.remove();
    res.status(200).json({
        success: true,
        message: "Complaint Deletion successful"
    })
});

