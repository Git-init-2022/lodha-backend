const express = require("express");
const {createDocument, deleteDocument, getDocumentsByType } = require("../controllers/documentController");
const router = express.Router();
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



router.route("/createDocument").post(createDocument);
router.route('/getDocumentsByType').get(getDocumentsByType)
router.route('/deleteDocument').get(deleteDocument);

 
module.exports = router