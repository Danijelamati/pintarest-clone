const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const replySchema = new Schema({
    text: String,
    createdOn: Date,
    author: String,
    editedOn: Date
 });

 const replyModel = mongoose.model("replyModel", replySchema);

const commentSchema = new Schema({
    text:String,
    createdOn: Date,
    replies: {
        type: [replySchema],
        default: []
    },
    author: String,
    editedOn: Date
});

const commentModel = mongoose.model("commentModel", commentSchema);

module.exports = {  
    commentModel,
    replyModel
};