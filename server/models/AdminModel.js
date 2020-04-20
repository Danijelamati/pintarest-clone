const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const AdminSchema = new Schema({    
    password: String,
    userName: String,
    signDate: Date,
    images: [String],
    saved:[String]
});

module.exports = mongoose.model("adminUser", AdminSchema);