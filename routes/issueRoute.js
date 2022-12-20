const express = require("express");
const { getAllIssues, createIssue,deleteIssue} = require("../controllers/issueController");
const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


router.route('/issue_types').get(getAllIssues)
router.route('/new_issue').post(createIssue);
router.route('/delete_issue').post(deleteIssue);


 
module.exports = router