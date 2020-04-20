const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const imageSchema = new Schema({
    owner: String,
    likes: [String],
    comments: [],
    location: String,
    title: String,
    text: String,
    createdOn: Date,
    auth: String
});

imageSchema.index({"owner": "text", "title": "text", "text": "text"});

module.exports = mongoose.model("imageSchema", imageSchema);

