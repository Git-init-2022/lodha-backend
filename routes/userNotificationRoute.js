const express = require("express");
const {createNotification, getAllUserNotifications, getUserNotifications, updateNotification, deleteNotification} = require("../controllers/userNotificationController");
const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



router.route('/postNotification').post(createNotification);
router.route('/getAllUserNotifications').get(getAllUserNotifications);
router.route('/getUserNotifications').get(getUserNotifications);
router.route('/updateUserNotification').get(updateNotification);
router.route('/deleteUserNotification').get(deleteNotification);

module.exports = router