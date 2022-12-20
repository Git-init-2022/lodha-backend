const express = require("express");
const { forgotPassword, updatePassword} = require("../controllers/resetPasswordController");
const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


router.route("/forgotpassword").get(forgotPassword);
router.route('/updatepassword').get(updatePassword);
 
module.exports = router