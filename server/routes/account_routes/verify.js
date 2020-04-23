const UserSession = require("../../models/UserSession");
const authType = require("../../util/authType");
const {ObjectId} = require('mongoose').Types;

module.exports = function(app){

    app.get("/account/verify", async (req,res)=> {

        try{
            const {token} = req.query;   
            
            if(!token || !ObjectId.isValid(token)){
                return res.json({"success" : false, "message" : "Invalid token"});
            }
            
            const session = await UserSession.findById(token);

            if(!session){
                return res.json({"success" : false, "message" : "Invalid token"});
            }            
           
            const auth = authType.get(session.auth) || "";

            if(!auth){
                return res.json({"success": false, "message" : "server error"});
            }

            const user = await auth.findById(session.userId);

            if(!user){
                return res.json({"success": false, "message" : "server error"});
            }

            let adminPrivilages = false;

            if(session.auth === "admin"){
                adminPrivilages= true;
            }
           
            return res.json({"success" : true, "message" : "Verified", "user" : session.userName, savedPins: user.saved, adminPrivilages});

        }
        catch(err){
            console.log(err);
            res.json({"success": false, "message": "Server error"});
        }

        
    });
}