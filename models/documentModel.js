const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Enter the document Name "]
    },
    Size: {
        type: Number,
        required: [true, "Enter the document Size"]
    },
    Hash: {
        type: String,
        required: [true, "Enter the document Hash"]
    },
    UploadDate: {
        type: Date,
        default: Date.now(),
    },
    Type: {
        type: String, 
        required: [true, "enter the type of document"]
    },
    Description: String,
    Title: String
})

module.exports = mongoose.model("Document", documentSchema);