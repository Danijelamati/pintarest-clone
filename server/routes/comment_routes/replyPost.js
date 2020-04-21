const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const {replyModel} = require("../../models/CommentModel");

module.exports = function(app){
    app.post("/image/reply",checkCredentials, async (req,res) => {

        try{
            const {token,userName,imageId,commentId,reply} = req.body;
            const {findSession} = req;
            
            if(!token || !userName || !imageId || !commentId || !reply || !findSession){
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
            
            return res.json({"success": true, "message": "replied", "reply": replyObj});
        }catch(err){
            console.log(err);
            return res.json({"success": false,error: "server error"});
        }
    });
}