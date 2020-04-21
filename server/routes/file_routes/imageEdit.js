const checkCredentials = require("../../middleware/checkCredentials");
const imageModel = require("../../models/ImageModel");

module.exports = function(app){
    app.put("/image/edit", checkCredentials, async(req,res)=> {
        try {
            const {userName,imageId,text,title} = req.body;

            if(!userName || !imageId || !text || !title){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);

            if(!image){
                return res.json({"success": false,"message": "server error"});
            }

            if(image.owner !== userName){
                return res.json({"success": false,"message": "action denied"});
            }

            image.text = text;
            image.title = title;
            image.editedOn = new Date();

            await image.save();

            return res.json({"success": true, "message": "image edited"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,"message": "server error"});
        }
    } )
}
