const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const {replyModel} = require("../../models/CommentModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    app.post("/image/reply",checkCredentials, async (req,res) => {

        try{
            const {userName,imageId,commentId,reply} = req.body;
           
            
            if(!userName || !imageId || !commentId || !reply ){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await ImageModel.findById(imageId);

            if(!image){
                return res.json({"success": false,error: "server error"});
            }
            
            const index = image.comments.findIndex( comm => comm._id == commentId);
            
            if(index === -1){
                return res.json({"success": false,error: "server error"});
            }

            const replyObj = new replyModel({
                text: reply, 
                author: userName, 
                createdOn: new Date()
            });

            image.comments[index].replies = [...image.comments[index].replies, replyObj];
            
            image.markModified("comments");

            await image.save();

            clearHash(`image/${imageId}`);
            
            return res.json({"success": true, "message": "replied", "reply": replyObj});
        }catch(err){
            console.log(err);
            return res.json({"success": false,error: "server error"});
        }
    });
}