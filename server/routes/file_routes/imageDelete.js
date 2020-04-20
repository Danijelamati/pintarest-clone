const imageModel = require("../../models/ImageModel");
const {s3Details} = require("../../util/config"); 
const s3 = require("../../util/awsS3");
const checkCredentials= require("../../middleware/checkCredentials");
const authType = require("../../util/authType"); 

module.exports = function(app){
    app.delete("/image/delete",checkCredentials, async (req,res) => {
        try{
            const {userName,token,imageId} = req.body;
            
            const {findSession} = req;
    
            if(!userName || !token || !imageId || !findSession){
                return res.status(401).json({"success": false, "message": "invalid credentials"});
            }            
    
            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.status(500).json({"success": false,"message": "server error"});
            }

            if(image.owner !== userName && findSession.auth !=="admin"){
                return res.status(403).json({"success": false,"message": "action denied"});
            }

            const Key = image.location.replace(s3Details.bucketURL,"");

            let auth = authType.get(findSession.auth);

            let user =[];

            if(findSession.auth==="admin"){   
         
                auth = authType.get(image.auth);
                user = await auth.findOne({userName: image.owner});
                
                if(!user){
                    return res.status(500).json({"success": false,"message": "server error"});
                }
            }
            
            if(user.length === 0){          
                user = await auth.findById(findSession.userId);
            }  
          
            const index = user.images.indexOf(imageId);
            
            if(index === -1){
                return res.status(500).json({"success": false,"message": "server error"});
            }
         
            user.images.splice(index,1);

            user.markModified("images");
            
            // promise dont work for some reason, same response but they dont delete object
            // so callback is used here
            s3.deleteObject({
                Bucket: s3Details.bucketName,
                Key
            }, (err,res) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({"success": false,"message": "server error"});
                }
                
            });   
            
            await image.delete();
            
            await user.save();

            return res.json({"success": true,"message": "deleted"});
            
        }
        catch(Err){
            console.log(Err);
            return res.status(500).json({"success": false,"message": "server error"});
        }     
    });
};