const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const emailUserSchema = new Schema({
    email: String,
    password: String,
    userName: String,
    signDate: Date,
    images: [String],
    profile: String,
    saved:[String]
});

const emailUser = mongoose.model("emailUser", emailUserSchema);

const githubUserSchema = new Schema({
    githubID: String,
    userName: String,
    signDate: Date,
    images: [String],
    profile: String,
    saved: [String]
});

const githubUser = mongoose.model("githubUser", githubUserSchema);

const googleUserSchema = new Schema({
    googleID: String,
    userName: String,
    signDate: Date,
    images: [String],
    profile: String,
    saved: [String]
});

const googleUser = mongoose.model("googleUser", googleUserSchema);


module.exports = {
    emailUser,
    githubUser,
    googleUser,
};
