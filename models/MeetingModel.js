const mongoose = require('mongoose');


const meetingSchema = mongoose.Schema({
    Title: {
       type: String,
       required: [true, "Enter the meeting title "]

    }, 
    Description : {
        type: String, 
        required: [true, "Enter the meeting description"]
    },
    Link: {
      type: String, 
      required: [true, "Enter the meeting Link"]
    },
    Date: {
        type: Date, 
        required: [true, "Enter the Meeting Date"],
    }, 
    Host : {
        type: String, 
        required: [true, "Enter the Host Name "],
        default : ''
    },
    Time:{
        type: String, 
        required: [true, "Enter the Meeting time"]
    }
})

module.exports = mongoose.model("Meeting", meetingSchema);
