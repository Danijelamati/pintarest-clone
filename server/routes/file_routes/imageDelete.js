const imageModel = require("../../models/ImageModel");
const {s3Details} = require("../../util/config"); 
const s3 = require("../../util/awsS3");
const checkCredentials= require("../../middleware/checkCredentials");
const authType = require("../../util/authType"); 
const {clearHash} = require("../../services/redisCache");
const {promisify} = require("util");

s3.deleteObject = promisify(s3.deleteObject);


module.exports = function(app){
    app.delete("/image/delete",checkCredentials, async (req,res) => {
        try{
            const {userName,imageId} = req.body;
            
            const {session} = req;
    
            if(!userName || !imageId || !session){
                return res.json({"success": false, "message": "invalid credentials"});
            }            
    
            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.json({"success": false,"message": "server error"});
            }

            if(image.owner !== userName && session.auth !=="admin"){
                return res.json({"success": false,"message": "action denied"});
            }

            const Key = image.location.replace(s3Details.bucketURL,"");

            let auth = authType.get(session.auth);

            let user =[];

            if(session.auth==="admin"){   
         
                auth = authType.get(image.auth);
                user = await auth.findOne({userName: image.owner});
                
                if(!user){
                    return res.json({"success": false,"message": "server error"});
                }
            }
            
            if(user.length === 0){          
                user = await auth.findById(session.userId);
            }  
          
            const index = user.images.indexOf(imageId);
            
            if(index === -1){
                return res.json({"success": false,"message": "server error"});
            }
         
            user.images.splice(index,1);

            user.markModified("images");           
            

            await s3.deleteObject({
                Bucket: s3Details.bucketName,
                Key
            });
            
            await image.delete();
            
            await user.save();

            clearHash("content");
            clearHash(`image/${imageId}`);

            return res.json({"success": true,"message": "deleted"});
            
        }
        catch(Err){
            console.log(Err);
            return res.json({"success": false,"message": "server error"});
        }     
    });
};