const signUp = require("./signup");
const login = require("./login"); 
const logout = require("./logout");
const verify = require("./verify");
const github = require("./github");
const google = require("./google");
const deleteAcc = require("./deleteAcc");
const changePassword = require("./changePassword");

module.exports = function(app){

    signUp(app);
   
    login(app);

    logout(app);

    verify(app);

    github(app);

    google(app);

    deleteAcc(app);

    changePassword(app);
};