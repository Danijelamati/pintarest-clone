const {v1 : uuid} = require("uuid");

const {s3Details} = require("../../util/config");
const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const authType = require("../../util/authType");
const s3 = require("../../util/awsS3");

module.exports = function(app){
    app.get("/image/upload",checkCredentials, async (req,res) => {
        try{            
            const {userName, token, img, text, title} = req.query;
            let {findSession} = req;

            if(!userName || !token || !img || !title){
                return res.status(401).json({"success": false, "message": "Invalid input"});
            }

            if(!findSession){
                return res.status(500).json({"success": false,error: "server error"});
            }    
    
            const type = img.split(".")[1];  
            const key = `${token}/${uuid()}.${type}`;

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
                auth: findSession.auth
            });
            
            await newImage.save();            

            const auth = authType.get(findSession.auth);            

            let findUser = await auth.findById(findSession.userId);

            if(!findUser){
                return res.status(500).json({"success": false,error: "server error"});
            }

            findUser.images.push(newImage.id);

            await findUser.save();

            return res.json({"success": true, "url": url});
            
        }
        catch(err){
            console.log(err);
            return res.status(500).json({"success": false,"error": "server error"});
        }
        
    });
    
};