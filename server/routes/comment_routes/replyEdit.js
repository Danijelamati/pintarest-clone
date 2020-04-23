const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    
    app.put("/image/reply/edit", checkCredentials, async (req,res) => {
        try {
            const {userName,imageId,commentId,replyId,text} = req.body;                   

            if(!userName || !imageId || !commentId || !replyId || !text ){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.json({"success": false,error: "server error"});
            }    

            const commentIndex = image.comments.findIndex(comm => comm._id == commentId);
            
            if(commentIndex === -1){
                return res.json({"success": false,error: "server error"});
            }

            const replyIndex = image.comments[commentIndex].replies.findIndex( rep => rep._id == replyId);

            if(replyIndex === -1){
                return res.json({"success": false,error: "server error"});
            }
            
            if(image.comments[commentIndex].replies[replyIndex].author !== userName){
                return res.json({"success": false,"message": "action denied"});
            }

            image.comments[commentIndex].replies[replyIndex].text = "edited reply";
            image.comments[commentIndex].replies[replyIndex].editedOn = new Date();
            
            image.markModified("comments");

            await image.save();

            clearHash(`image/${imageId}`);

            return res.json({"success": true, "message": "reply edited"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,error: "server error"});
        }
    })
};