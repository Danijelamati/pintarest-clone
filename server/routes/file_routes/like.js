const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");

module.exports = function(app){
    app.put("/image/like",checkCredentials, async (req,res) => {
        try{

            const{token, userName, action, imageId} = req.body;
            const {findSession} = req;
            
            if(!token || !userName || !action || !imageId || !findSession ){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            if(!action === "like" && !action==="unlike"){
                return res.json({"success": false, message:"invalid credentials"});
            }

            const image = await imageModel.findById(imageId);

            if(!image){
                return res.json({"success": false, "message": "server error"}); 
            }

            const index = image.likes.indexOf(userName);

         
            if (action === "unlike"){
                
                if(index === -1){
                    return res.json({"success": false, "message": "allready unliked"});
                }

                image.likes.splice(index,1);

                await image.save();

                return res.json({"success": true, "message": "unliked"});
            }

            if(index !== -1){
                return res.json({"success": false, "message": "allready liked"});
            }

            image.likes = [...image.likes, userName];

            await image.save();
          
            return res.json({"success": true, "message": "liked"});


        }catch(err){
            console.log(err);
            return res.json({"success": false, "message": "server error"});
        }
    })
}