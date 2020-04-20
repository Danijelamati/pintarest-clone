const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");

module.exports = function(app){
    
    app.delete("/image/reply", checkCredentials, async (req,res) => {
        try {
            const {token,userName,imageId,commentId,replyId} = req.body;  
            const{findSession} = req;              

            if(!token || !userName || !imageId || !commentId || !replyId || !findSession ){
                return res.status(401).json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.status(500).json({"success": false,error: "server error"});
            }    

            const commentIndex = image.comments.findIndex(comm => comm._id == commentId);
            
            if(commentIndex === -1){
                return res.status(500).json({"success": false,error: "server error"});
            }

            const replyIndex = image.comments[commentIndex].replies.findIndex( rep => rep._id == replyId);

            if(replyIndex === -1){
                return res.status(500).json({"success": false,error: "server error"});
            }
            
            if(image.comments[commentIndex].replies[replyIndex].author !== userName && findSession.auth !=="admin"){
                return res.status(403).json({"success": false,"message": "action denied"});
            }

            image.comments[commentIndex].replies.splice(replyIndex,1);
            
            image.markModified("comments");

            await image.save();

            return res.json({"success": true, "message": "reply deleted"});


        } catch (error) {
            console.log(error);
            return res.status(500).json({"success": false,error: "server error"});
        }
    })
};