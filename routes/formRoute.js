const express = require("express");
const { getAllForms, createForm, deleteForm, updateForm} = require("../controllers/formController");
const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.route('/AllForms').get(getAllForms)
router.route('/form/new').post(createForm);
router.route('/deleteform').get(deleteForm);
router.route('/updateform').get(updateForm);
module.exports = router