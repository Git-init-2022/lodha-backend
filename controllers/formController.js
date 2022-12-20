const Form = require("../models/formModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'forms',
    streams: [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        type: 'rotating-file',
        level: 'info',
        path: __dirname+'/logs/forms.log',
        period: '1m',
        count: 12
    }
    ]
    });




// Create form
exports.createForm = catchAsyncErrors(async (req, res, next) => {

    const { Title, Description, Link } = req.body;
    const title1 = await Form.find({ Title: Title, Description: Description, Link: Link })
    if (title1 && Object.keys(title1).length) {
        res.status(201).json({
            success: false,
            message: "Form already exists"
        });
    }
    else {
        const form = await Form.create(req.body);
        res.status(201).json({
            success: true,
            form
        });
    }
});

// Get All forms
exports.getAllForms = catchAsyncErrors(async (req, res) => {
    const forms = await Form.find();
    res.status(200).json({
        success: true,
        forms
    });
});

//update form

exports.updateForm = catchAsyncErrors(async(req,res,next)=> {
    
    let form1 = await Form.findById(req.query._id);
    if(!form1){
        return next(new ErrorHandler("complaint not found",404));
    }
    const form2 = form1;
    form1.Description = req.query.Description;
    form1.Title = req.query.Title;
    form1.Link = req.query.Link;
    form1.save();
    log.info(`${req.query.Admin} has modified form: ${form2}  to: ${form1}`);
    form1 = await Form.find({Title: req.query.Title, Description: req.query.Description, Link:req.query.Link });
    res.status(201).json({
        success: true,
        message: "SuccessFully updated"
    })
});


// delete form details 

exports.deleteForm = catchAsyncErrors(async (req, res) => {
    const form1 = await Form.findById(req.query._id);
    if (!form1) {
        res.status(201).json({
            success: false,
            message: "form Does not exists"
        })
    }
    else {
        log.info(`${req.query.Admin} has deleted Form: ${form1}`)
        await form1.remove();
        res.status(201).json({
            success: true,
            message: "form Deletion successful"
        })
    }
});