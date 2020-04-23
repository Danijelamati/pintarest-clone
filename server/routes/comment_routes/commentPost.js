const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const {commentModel} = require("../../models/CommentModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    app.post("/image/comment",checkCredentials, async (req,res) => {

        try{
            const {userName,imageId,comment} = req.body;
            
            if(!userName || !imageId || !comment ){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await ImageModel.findById(imageId);

            if(!image){
                return res.json({"success": false,error: "server error"});
            }
            
            let newComment = new commentModel({
                text: comment,                
                createdOn: new Date(),
                author: userName,
                replies:[]
            });          

            image.comments.push(newComment);

            await image.save();

            clearHash(`image/${imageId}`);
           
            return res.json({"success": true, "message": "commented", newComment});
        }catch(err){
            console.log(err);
            return res.json({"success": false,error: "server error"});
        }
    });
}