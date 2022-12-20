const mongoose = require("mongoose"); 

const formSchema = mongoose.Schema({
    Title: {
     type: String, 
     required: [true, "Enter the form title"]
    },
    Description : {
      type: String, 
      required: [true, "Enter the form Desc"]
    },
    Link: {
        type: String,
        required: [true, "Enter the Form Link"]
    }
})

module.exports = mongoose.model("Form", formSchema);