const {v1 : uuid} = require("uuid");

const {s3Details} = require("../../util/config");
const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const authType = require("../../util/authType");
const s3 = require("../../util/awsS3");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    app.get("/image/upload",checkCredentials, async (req,res) => {
        try{            
            const {userName, img, text, title} = req.query;
            let {session} = req;

            if(!userName || !img || !title){
                return res.json({"success": false, "message": "Invalid input"});
            }

            if(!session){
                return res.json({"success": false,error: "server error"});
            }

            const auth = authType.get(session.auth);            

            let user = await auth.findById(session.userId);

            if(!user){
                return res.json({"success": false,error: "server error"});
            }                
    
            const type = img.split(".")[1];  
            const key = `${user._id}/${uuid()}.${type}`;

            const url = await s3.getSignedUrl("putObject", {
                Bucket: s3Details.bucketName,
                ContentType: `image/${type}`,
                Key: key
            });       
            
            const location = s3Details.bucketURL+key;

            const newImage = new ImageModel({
                owner: userName,
                location,
                createdOn: new Date(),
                title,
                text,
                auth: session.auth
            });
            
            await newImage.save();            

            

            user.images.push(newImage.id);

            await user.save();

            clearHash("content");

            return res.json({"success": true, "url": url});
            
        }
        catch(err){
            console.log(err);
            return res.json({"success": false,"error": "server error"});
        }       
        
    });
    
};