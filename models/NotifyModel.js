const mongoose = require('mongoose'); 

const NotifySchema = mongoose.Schema({
    Title: {
        type: String,
        required: [true, "Notification title not found!"],
    },
    Description: {
       type: String,
       required: [true, "Notification "]
    },
    PostedDate: { 
        type: Date
    }, 
    FileHashes: String, 
    FileObjects: [String]
})

module.exports = mongoose.model("Notification", NotifySchema);