const checkCredentials = require("../../middleware/checkCredentials");
const authType = require("../../util/authType");

module.exports = function(app){

        app.post("/user/savepin",checkCredentials, async (req,res) => {
            try{
                const {imageId,action} = req.body;
                
                const {session} = req;

                if( !imageId || !action || !session){
                    return res.json({"success": false, message:"server error"});
                }

                if(!action === "pin" && !action ==="unpin"){
                    return res.json({"success": false, message:"invalid credentials"});
                }

                const auth = authType.get(session.auth);

                const findUser = await auth.findById(session.userId);

                if(!findUser){
                    return res.json({"success": false, message: "server error"});
                }

                const findImage = findUser.saved.indexOf(imageId);

                if(action === "unpin" && findImage !== -1){
                    findUser.saved.splice(findImage, 1);
                    await findUser.save();
                    return res.json({"success": true, message: "image unpined", "setAction": "PIN"});
                }

                if(action=== "unpin"){
                    return res.json({"success": true, message: "image not found"});
                }

                if(findImage !== -1){
                    return res.json({"success": false, message: "allready pined"});
                }

                findUser.saved.push(imageId);

                await findUser.save();

                return res.json({"success": true, "message": "image pined", "setAction": "UNPIN"});
                
            }
            catch(err){
                console.log(err);
                return res.json({"success": false,"message": "server error"});
            }
        })
};