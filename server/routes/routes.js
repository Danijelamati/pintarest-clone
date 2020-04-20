const account = require("./account_routes/account");
const fileRoutes = require("./file_routes/fileRoutes");
const commentRoutes = require("./comment_routes/commentRoutes");
const about = require("./about/about");
const signAdmin = require("./admin/signAdmin");
const logAdmin = require("./admin/logAdmin");

module.exports = function(app){
        
    account(app);    

    fileRoutes(app);

    commentRoutes(app);

    about(app);

    //admin routes
    
    signAdmin(app);

    logAdmin(app);

};