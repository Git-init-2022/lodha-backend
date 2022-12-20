const express = require("express"); 
const {createNotification, getAllNotifications} = require("../controllers/NotifyController");
const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.route("/AllNotifications").get(getAllNotifications); 
router.route("/notification/new").post(createNotification);


module.exports = router;