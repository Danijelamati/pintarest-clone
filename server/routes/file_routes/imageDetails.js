const imageModel = require("../../models/ImageModel");

module.exports = function(app){

    app.get("/image/details", async (req,res) => {
        try{
            const {imageId} = req.query;
            
            if(!imageId){                
                return res.status(401).json({"success": false, "message": "invalid credentials"});
            }

            const image = await imageModel.findById(imageId);

            if(!image){                
                return res.status(500).json({"success": false,"error": "server error"});
            }

            return res.json({"success": true, image});

            
        }
        catch(err){
            console.log(err);
            return res.status(500).json({"success": false,"error": "server error"});
        }
    })
};