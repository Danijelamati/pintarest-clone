const checkCredentials = require("../../middleware/checkCredentials");
const authType = require("../../util/authType");
const ImageModel = require("../../models/ImageModel");
const {s3Details} = require("../../util/config");
const s3 = require("../../util/awsS3");

module.exports = function(app){

    app.delete("/account/delete", checkCredentials, async(req,res) => {
        try{
            
            const{userName, token} = req.body;

            const{findSession} = req;

            if(!userName || !token || !findSession){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const auth = authType.get(findSession.auth);

            const user = await auth.findById(findSession.userId);

            if(!user){
                return res.json({"success": false,"message": "server error"});
            }
            
            if(user.images.length > 0){
                const images = await ImageModel.find().where('_id').in(user.images).exec();

                const keys = images.map( obj =>{return {"Key": obj.location.replace(s3Details.bucketURL, "")}});                
                
                s3.deleteObjects({
                    Bucket: s3Details.bucketName,
                    Delete:{
                        Objects: keys
                    }
                }, (err, res) => {
                    if(err){
                        console.log(err);
                        return res.json({"success": false,"message": "server error"});
                    }

                });
                
                await ImageModel.deleteMany().where("_id").in(user.images).exec();
            }                  

            await user.delete();

            await findSession.delete();

            return res.json({ "success": true, "message": "user deleted"});
           
        }catch(err){
            console.log(err);
            return res.json({"success": false,"message": "server error"});
        }
    })
};