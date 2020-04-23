const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");
const {clearHash} = require("../../services/redisCache");

module.exports = function(app){
    app.put("/image/comment/edit",checkCredentials, async(req,res)=> {
        try {

            const{userName,imageId,commentId, text} = req.body;             

            if(!userName || !imageId || !commentId || !text){
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

            if(image.comments[index].author !== userName){
                return res.json({"success": false,"message": "action denied"});
            }
            
            image.comments[index].text = text;
            image.comments[index].editedOn = new Date();
            
            image.markModified("comments");

            await image.save();

            clearHash(`image/${imageId}`);

            return res.json({"success": true, "message": "comment edited"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,error: "server error"});
        }
    });
};