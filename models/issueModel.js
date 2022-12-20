const mongoose = require('mongoose');


const issueSchema = mongoose.Schema({
    Name: {
       type: String,
       required: [true, "Enter the Issue Name "]

    }
})

module.exports = mongoose.model("Issue", issueSchema);
