const upload = require("./upload");
const content = require("./content");
const myPins = require("./myPins");
const savePin = require("./savePin");
const imageDetails = require("./imageDetails");
const like = require("./like");
const search = require("./search");
const imageDelete= require("./imageDelete");
const imageEdit = require("./imageEdit"); 

module.exports = function(app){

  upload(app);  

  content(app);

  myPins(app);

  savePin(app);

  imageDetails(app);

  like(app);

  search(app);

  imageDelete(app);

  imageEdit(app);
  
};