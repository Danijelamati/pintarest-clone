const commentPost = require("./commentPost");
const replyPost = require("./replyPost");
const commentDelete = require("./commentDelete"); 
const replydelete = require("./replyDelete");
const commentEdit = require("./commentEdit");
const replyEdit = require("./replyEdit");

module.exports = function(app){

    commentPost(app);

    replyPost(app);

    commentDelete(app);

    replydelete(app);

    commentEdit(app);

    replyEdit(app);

};