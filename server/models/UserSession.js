const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const userSessionSchema = new Schema({
    userId: String,
    userName: String,
    auth: String 
});

module.exports = mongoose.model("userSession", userSessionSchema);