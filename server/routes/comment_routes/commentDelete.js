const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");

module.exports = function(app){
    app.delete("/image/comment",checkCredentials, async(req,res)=> {
        try {

            const{userName,token,imageId,commentId} = req.body;   
            const{findSession} = req;

            if(!userName || !imageId || !token || !imageId || !commentId || !findSession){
                return res.status(401).json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);
            
            if(!image){
                return res.status(500).json({"success": false,error: "server error"});
            }            

            const index = image.comments.findIndex(comm => comm._id == commentId);
            
            if(index === -1){
                return res.status(500).json({"success": false,error: "server error"});
            }

            if(image.comments[index].author !== userName && findSession.auth !=="admin"){
                return res.status(403).json({"success": false,"message": "action denied"});
            }
            
            image.comments.splice(index,1); 
            
            image.markModified("comments");

            await image.save();

            return res.json({"success": true, "message": "comment deleted"});


        } catch (error) {
            console.log(error);
            return res.status(500).json({"success": false,error: "server error"});
        }
    });
};