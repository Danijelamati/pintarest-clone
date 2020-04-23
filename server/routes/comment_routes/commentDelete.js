const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    app.delete("/image/comment",checkCredentials, async(req,res)=> {
        try {

            const{userName,imageId,commentId} = req.body;   
            const{session} = req;

            if(!userName || !imageId  || !imageId || !commentId || !session){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.json({"success": false,error: "server error"});
            }            

            const index = image.comments.findIndex(comm => comm._id == commentId);
            
            if(index === -1){
                return res.json({"success": false,error: "server error"});
            }

            if(image.comments[index].author !== userName && session.auth !=="admin"){
                return res.json({"success": false,"message": "action denied"});
            }
            
            image.comments.splice(index,1); 
            
            image.markModified("comments");

            await image.save();

            clearHash(`image/${imageId}`);

            return res.json({"success": true, "message": "comment deleted"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,error: "server error"});
        }
    });
};