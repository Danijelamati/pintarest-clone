const checkCredentials = require("../../middleware/checkCredentials");
const authType = require("../../util/authType");
const crypt = require("../../util/crypt");

module.exports = function(app){

    app.post("/account/changepassword", checkCredentials, async(req,res) => {
        try {
            const {userName, oldPass, newPass} = req.body;

            const{findSession} = req;

            if(!userName || !oldPass || !newPass || !findSession){
                return res.json({"success": false, "message": "invalid credentials"});
            }

            if(!findSession.auth === "admin" && !findSession.auth === "email"){
                return res.json({"success": false, "message": "invalid user"});
            }

            const auth = authType.get(findSession.auth);

            let user = await auth.findById(findSession.userId);

            if(!user){
                return res.json({"success": false,"message": "server error"});
            }
            
            const compare = await crypt.compare(oldPass, user.password);

            if(!compare){
                return res.json({"success": false, "message": "Invalid password"});
            }

            const password = await crypt.hash(newPass);

            user.password = password;

            await user.save();

            return res.json({"success" : true, "message" : "password changed"});


        } catch (error) {
            console.log(error);
            return res.json({"success": false,"message": "server error"});
        }
    })
};