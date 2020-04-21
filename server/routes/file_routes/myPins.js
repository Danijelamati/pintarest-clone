const ImageModel = require("../../models/ImageModel");
const authType = require("../../util/authType");
const checkCredentials = require("../../middleware/checkCredentials");


const actionType = new Map()
    .set("mypins", "images")
    .set("saved", "saved");

module.exports = function(app){

    app.get("/user/mypins",checkCredentials, async (req,res) => {
        try{
            const {token,action} = req.query;
            const {findSession} = req; 
               
            if(!token  || !findSession || !action){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const act = actionType.get(action) || "";

            if(!act){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const auth = authType.get(findSession.auth);

            const findUser = await auth.findById(findSession.userId);
       
            if(!findUser){
                
                return res.json({"success": false,error: "server error"});
            }

            if(findUser[act] === []){
                return res.json({"success": true, "images": []});
            }           

            const images = await ImageModel.find().where('_id').in(findUser[act]).exec();
         
            return res.json({"success": true, "images": images});

        }
        catch(err){
            console.log(err);
            return res.json({"success": false,error: "server error"});
        }

    });
};