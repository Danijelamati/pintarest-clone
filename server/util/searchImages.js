const ImageModel = require("../models/ImageModel");

module.exports = async (search) => {
    try{
        
        if(!search){
            return "error";
        }       

        const allImages = await ImageModel.find( { $text: { $search: search } });

        return allImages;
        
    }
    catch(err){
        console.log(err);
        return "error";
    }
}