const {emailUser, githubUser, googleUser} = require("../models/UserModel");
const adminUser = require("../models/AdminModel");

const authType = new Map()
    .set("email", emailUser)
    .set("github", githubUser)
    .set("google", googleUser)
    .set("admin", adminUser);


module.exports = authType;

