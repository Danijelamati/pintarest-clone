const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const replySchema = new Schema({
    text: String,
    createdOn: Date,
    author: String
 });

 const replyModel = mongoose.model("replyModel", replySchema);

const commentSchema = new Schema({
    text:String,
    createdOn: Date,
    replies: {
        type: [replySchema],
        default: []
    },
    author: String
});

const commentModel = mongoose.model("commentModel", commentSchema);

module.exports = {  
    commentModel,
    replyModel
};