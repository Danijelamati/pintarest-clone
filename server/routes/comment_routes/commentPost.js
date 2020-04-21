const checkCredentials = require("../../middleware/checkCredentials");
const ImageModel = require("../../models/ImageModel");
const {commentModel} = require("../../models/CommentModel");

module.exports = function(app){
    app.post("/image/comment",checkCredentials, async (req,res) => {

        try{
            const {token,userName,imageId,comment} = req.body;
            const {findSession} = req;
            
            if(!token || !userName || !imageId || !comment || !findSession){
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
           
            return res.json({"success": true, "message": "commented", newComment});
        }catch(err){
            console.log(err);
            return res.json({"success": false,error: "server error"});
        }
    });
}