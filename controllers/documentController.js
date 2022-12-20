
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userNotification = require("../models/userNotification");
const Document = require("../models/documentModel");

exports.createDocument = catchAsyncErrors(async (req, res, next) => {
    const document1 = await Document.find(req.body);
    console.log(req.body);
    if (document1 && Object.keys(document1).length) {
        res.status(201).json({
            success: false,
            message: "failure"
        })
    }
    else {
        const document1 = await Document.create(req.body)
        res.status(201).json({
            success: true,
            message: "success"
        });
    }
});


exports.getDocumentsByType = catchAsyncErrors(async (req, res, next) => {
    let documents = [];
    if (req.query.Type === 'all') {
        documents = await Document.find();
    }
    else {
        documents = await Document.find({ Type: req.query.Type });
    }
    res.status(200).json({
        success: true,
        documents
    })
});


exports.deleteDocument = catchAsyncErrors(async (req, res, next) => {
    const document1 = await Document.findById(req.query.document._id);
    if (!document1) {
        return next(new ErrorHandler("notification not found", 404));
    }
    await document1.remove();
    res.status(200).json({
        success: true,
        message: "Document Deletion successful"
    })
});