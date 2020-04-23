const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    
    app.delete("/image/reply", checkCredentials, async (req,res) => {
        try {
            const {userName,imageId,commentId,replyId} = req.body;  
            const{session} = req;              

            if(!userName || !imageId || !commentId || !replyId || !session ){
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
            
            if(image.comments[commentIndex].replies[replyIndex].author !== userName && session.auth !=="admin"){
                return res.json({"success": false,"message": "action denied"});
            }

            image.comments[commentIndex].replies.splice(replyIndex,1);
            
            image.markModified("comments");

            await image.save();

            clearHash(`image/${imageId}`);

            return res.json({"success": true, "message": "reply deleted"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,error: "server error"});
        }
    })
};