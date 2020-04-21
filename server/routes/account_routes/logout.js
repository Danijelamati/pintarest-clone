const UserSession = require("../../models/UserSession");
const {ObjectId} = require('mongoose').Types;

module.exports = function(app){

    app.get("/account/logout", async (req,res)=> {
        try{

            const {token} = req.query;
            
            if(!token || !ObjectId.isValid(token)){
                return res.json({"success" : false, "message" : "Invalid token"});
            } 

            const session = await UserSession.findById(token);

            if(!session){
                return res.json({"success" : false, "message" : "Invalid token"});
            }  

            await session.delete();
            
            return res.json({"success" : true, "message" : "User logged out"});

        }
        catch(err){
            console.log(err);
            res.json({"success": false, "message": "Server error"});
        }
    });

};
