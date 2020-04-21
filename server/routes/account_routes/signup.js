const {emailUser} = require("../../models/UserModel");
const validator = require("email-validator");
const crypt = require("../../util/crypt");
const UserSession = require("../../models/UserSession");

module.exports = function (app){

    app.post("/account/signup", async (req,res)=> {

        try{
            const {password, userName} = req.body;
            let {email} = req.body;  
                
            if(!email || !password || !userName) return res.json({"success" : false, "message": "Fields cannot be blank"});

            email.toLowerCase().trim();

            const valid = validator.validate(email);
           
            if(!valid){
                return res.json({"success" : false, "message": "Invalid email"});
            }

            const find = await emailUser.findOne({email});          

            if(find){
                return res.json({"success" : false, "message" : "User with that email exists"});
            }      
            
            const findUserName = await UserSession.findOne({userName});

            if(find){
                return res.json({"success" : false, "message" : "User name exists"});
            } 
            
            const hashedPassword = await crypt.hash(password);            
           
            const newUser = new emailUser({
                email,
                password: hashedPassword,
                userName,
                signDate: new Date
            });

            await newUser.save();
            
            const newSession = new UserSession({
                userId: newUser.id,
                isLogedIn: true,
                userName,
                auth: "email"
            });

            await newSession.save();

            return res.json({"success" : true, "message" : "signed up", "token": newSession.id, "user": userName});
            
        }
        catch(err){
            console.log(err);
            res.json({"success" : false, "message" : "Server error"});
        }
    });

};