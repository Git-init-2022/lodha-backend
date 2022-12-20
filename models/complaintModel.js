const mongoose = require("mongoose");



const complaintSchema = mongoose.Schema({
    Issue: {
        type: String,
        required: [true, "Please Enter Issue Type"],
        default: 'Other',
        required: true
    },
    Description: {
        type: String,
        required: [true, "Please Enter Description of Complaint"]
    },
    Status: {
        type: Number,
        required: true,
        default: 0
    },
    Time: {
        type: Date,
        default: Date.now,
    },
    FlatNo: {
        type: String,
        required: [true,"Please Enter Flat Number"]
    },
    FileHashes: String,
    FileObjects: [String] 
})

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = { Complaint};
