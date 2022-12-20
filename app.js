const express = require('express');
const errorMiddleWare = require("./middleware/error")
const app = express();

app.use(express.json());

//Route Imports
const users = require("./routes/userRoute");
const complaints = require("./routes/complaintsRoute");
const issues = require("./routes/issueRoute");
const notification = require("./routes/notificationRoute");
const form = require('./routes/formRoute');
const meeting = require('./routes/meetingRoute');
const resetPassword = require("./routes/resetPasswordRoute")
const userNotification = require("./routes/userNotificationRoute");
const document = require("./routes/documentRoute");

app.use("/api/v1", users);
app.use("/api/v1",complaints);
app.use("/api/v1",issues);
app.use("/api/v1",notification);
app.use("/api/v1", form);
app.use("/api/v1", meeting);
app.use("/api/v1", userNotification)
app.use("/api/v1", resetPassword);
app.use("/api/v1", document);

// MiddleWare for Errors


module.exports = app;