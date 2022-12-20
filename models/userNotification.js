const mongoose = require("mongoose")
const userNotification = mongoose.Schema({
    FlatNo: {
        type: String,
        required: [true, "Please Enter Flat Number"]
    },
    NotificationTitle: {
        type: String,
        required: true
    },
    NotificationDesc: {
        type: String,
        required: true
    },
    Time: {
        type: Date,
        default: Date.now()
    },
    Flag: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("userNotification", userNotification);