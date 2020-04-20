const crypt = require("../../util/crypt");
const userSession = require("../../models/UserSession");
const adminUser = require("../../models/AdminModel");

module.exports = function(app){
    app.get("/admin", async(req,res) => {
        try {
            const{userName,password} = req.query;
            
            if(!userName || !password){
                return res.status(401).json({"success": false, "message": "Invalid input"});
            }

            const user = await adminUser.findOne({userName});

            if(!user){
                return res.status(401).json({"success": false, "message": "Invalid input"});
            }
          
            const compare = await crypt.compare(password,user.password);

            if(!compare){
                return res.status(401).json({"success": false, "message": "Invalid input"}); 
            }

            const session = new userSession({
                userName,
                userId: user._id,
                auth: "admin"
            });

            await session.save();

            return res.json({"success" : true, "message" : "loged in", "token": session.id});

        } catch (error) {
            console.log(error);
            return res.status(500).json({"success": false, "message": "Server error"});
        }
    })
};