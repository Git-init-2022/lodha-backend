const express = require("express");
const { getAllusers, createUser, updateUser, deleteUser, getUser, loginUser, updateProfile } = require("../controllers/userController");
const router = express.Router();
const multer = require('multer');
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



router.route("/login").post(loginUser);
router.route('/users').get(getAllusers)
router.route('/register').post(createUser);
router.route('/userupdate').get(updateUser)
router.route('/userdelete').get(deleteUser);
router.route('/singleUser').get(getUser);
 router.route('/updateProfile').post(updateProfile);
module.exports = router