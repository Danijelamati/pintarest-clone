const commentPost = require("./commentPost");
const replyPost = require("./replyPost");
const commentDelete = require("./commentDelete"); 
const replydelete = require("./replyDelete");

module.exports = function(app){

    commentPost(app);

    replyPost(app);

    commentDelete(app);

    replydelete(app);
};