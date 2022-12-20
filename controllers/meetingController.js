const Meeting = require("../models/MeetingModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'meetings',
    streams: [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        type: 'rotating-file',
        level: 'info',
        path: __dirname+'/logs/meetings.log',
        period: '1m',
        count: 12
    }
    ]
    });


// Create Meeting
exports.createMeeting = catchAsyncErrors(async (req, res, next) => {

    const { Title, Description, Link, Host, Date, Time } = req.body;
    const meeting1 = await Meeting.find({ Title: Title, Description: Description, Link: Link, Host: Host, Date: Date, Time: Time });
    if (meeting1 && Object.keys(meeting1).length) {
        res.status(201).json({
            success: false, 
            message: "Meeting already exists"
        });
    }
    else {
        const meeting = await Meeting.create(req.body);
        res.status(201).json({
            success: true,
            meeting
        });
    }
});

// Get All Meetings
exports.getAllMeetings = catchAsyncErrors(async (req, res) => {
    const meetings = await Meeting.find().sort({"Date":1, "Time":1});
    res.status(200).json({
        success: true,
        meetings
    });
});

// update meeting 
exports.updateMeeting = catchAsyncErrors(async(req,res,next)=> {
    
    let meeting1 = await Meeting.findById(req.query._id);
    if(!meeting1){
        return next(new ErrorHandler("meeting not found",404));
    }
    meeting1.Description = req.query.Description;
    meeting1.Title = req.query.Title;
    meeting1.Link = req.query.Link;
    meeting1.Date = req.query.Date;
    meeting1.Time = req.query.Time;
    meeting1.Host = req.query.Host;
    meeting1.save();
    res.status(201).json({
        success: true,
        message: "SuccessFully updated"
    })
});


// delete meeting details 

exports.deleteMeeting = catchAsyncErrors(async (req, res) => {
    const meeting1 = await Meeting.findById(req.query._id);
   
    if (!meeting1) {      
        res.status(201).json({
            success: false,
            message: "meeting Does not exists"
        })
    }
    else {
        log.info(`${req.query.Admin} has delete the meeting: ${meeting1}`);
        await meeting1.remove();
        res.status(201).json({
            success: true,
            message: "meeting Deletion successful"
        })
    }
});
