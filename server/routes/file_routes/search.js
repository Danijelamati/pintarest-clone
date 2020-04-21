const searchImages = require("../../util/searchImages");

module.exports = function(app){

    app.get("/image/search", async(req,res)=> {
        try{
            const {search} = req.query;
            
            if(!search){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            const images = await searchImages(search);
            
            if(images === "error"){
                return res.json({"success": false, "message":"server error"});
            }
            
            return res.json({"success": true, images});
        }
        catch(err){
            console.log(err);
            return res.json({"success": "false", "message":"server error"});
        }
    })
};