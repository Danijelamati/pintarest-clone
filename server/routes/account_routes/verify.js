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
            
            const findSession = await UserSession.findById(token);

            if(!findSession){
                return res.json({"success" : false, "message" : "Invalid token"});
            }            
           
            const auth = authType.get(findSession.auth) || "";

            if(!auth){
                return res.json({"success": false, "message" : "server error"});
            }

            const user = await auth.findById(findSession.userId);

            if(!user){
                return res.json({"success": false, "message" : "server error"});
            }

            let adminPrivilages = false;

            if(findSession.auth === "admin"){
                adminPrivilages= true;
            }
           
            return res.json({"success" : true, "message" : "Verified", "user" : findSession.userName, savedPins: user.saved, adminPrivilages});

        }
        catch(err){
            console.log(err);
            res.json({"success": false, "message": "Server error"});
        }

        
    });
}