const validator = require("email-validator");

const {emailUser} = require("../../models/UserModel");
const UserSession = require("../../models/UserSession");
const {compare} = require("../../util/crypt");

module.exports = function(app){

    app.post("/account/login", async (req,res)=> {
        try{
            const {password} = req.body;            
            let {email} = req.body;  
            
            if(!email || !password){
                return res.json({"success": false, "message": "Invalid input"});
            }

            email.toLowerCase().trim();

            const valid = validator.validate(email);
           
            if(!valid){
                return res.json({"success": false, "message": "Invalid input"});
            }
  
            const user = await emailUser.findOne({email});

            if(!user){
                return res.json({"success": false, "message": "Invalid email"});
            }

            const compareHash = await compare(password, user.password);
            
            if(!compareHash){
                return res.json({"success": false, "message": "Invalid password"});
            }
   
            const session = new UserSession({
                userId: user._id,
                userName: user.userName,
                auth: "email"
            });          
                               
            await session.save();

            return res.json({"success" : true, "message" : "loged in", "token": session.id, "user": session.userName});

        }
        catch(err){
            console.log(err);
            return res.json({"success": false, "message": "Server error"});
        }
    });
    
};