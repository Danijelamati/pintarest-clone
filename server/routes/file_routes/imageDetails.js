const imageModel = require("../../models/ImageModel");

module.exports = function(app){

    app.get("/image/details", async (req,res) => {
        try{
            const {imageId} = req.query;
            
            if(!imageId){                
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId).cache({key : `image/${imageId}`});

            if(!image){                
                return res.json({"success": false,"error": "server error"});
            }

            return res.json({"success": true, image});

            
        }
        catch(err){
            console.log(err);
            return res.json({"success": false,"error": "server error"});
        }
    })
};