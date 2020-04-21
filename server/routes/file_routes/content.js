const imageModel = require("../../models/ImageModel");
const {s3Bucket} = require("../../util/config");

module.exports = function(app){

    app.get("/content", async (req,res) => {
        try{
            console.log("content")
            let images = await imageModel.find({});

            if(!images){
                return res.json({"success": false, "message": "server error"});
            }
            
            images = images
                    .sort((a,b)=>{   
                    return new Date(b.createdOn)- new Date(a.createdOn)
                    })
                    .map( img => {
                        return {
                            title: img.title,
                            location: img.location,
                            _id: img._id
                        };
                    });           
            
            return res.json({success: true, images});
            
        }
        catch(err){
            console.log(err);
            return res.json({"success": false, "message": "server error"});
        }


    });
};