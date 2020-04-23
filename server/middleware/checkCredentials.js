const UserSession = require("../models/UserSession");

module.exports = async function(req,res,next){
    try{       
        const userName = req.query.userName || req.body.userName;
        const token = req.query.token || req.body.token;

        const session = await UserSession.findById(token);
        
        if(!session  || (userName !== session.userName)){
            return res.json({"success": false, "message": "access denied"});
        }  

        req.session = session;

        next();
    }
    catch(err){
        console.log(err);
        return res.json({error: "server error"});
    }
};