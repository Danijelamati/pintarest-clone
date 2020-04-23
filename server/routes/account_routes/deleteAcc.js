const checkCredentials = require("../../middleware/checkCredentials");
const authType = require("../../util/authType");
const ImageModel = require("../../models/ImageModel");
const {s3Details} = require("../../util/config");
const s3 = require("../../util/awsS3");
const {clearHash} = require("../../services/redisCache");
const {promisify} = require("util");


module.exports = function(app){

    app.delete("/account/delete", checkCredentials, async(req,res) => {
        try{
            
            const{userName, token} = req.body;

            const{session} = req;

            if(!userName || !token || !session){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const auth = authType.get(session.auth);

            const user = await auth.findById(session.userId);

            if(!user){
                return res.json({"success": false,"message": "server error"});
            }
            
            if(user.images.length > 0){
                const images = await ImageModel.find().where('_id').in(user.images).exec();

                const keys = images.map( obj =>{return {"Key": obj.location.replace(s3Details.bucketURL, "")}});                
                
                await s3.deleteObjects({
                    Bucket: s3Details.bucketName,
                    Delete:{
                        Objects: keys
                    }
                });
                
                await ImageModel.deleteMany().where("_id").in(user.images).exec();
            }                  

            await user.delete();

            await session.delete();

            images.forEach(img => {
                clearHash(`image/${img._id}`);
            });

            return res.json({ "success": true, "message": "user deleted"});
           
        }catch(err){
            console.log(err);
            return res.json({"success": false,"message": "server error"});
        }
    })
};