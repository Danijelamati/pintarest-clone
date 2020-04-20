const {adminInvite} = require("../../util/config");
const adminUser = require("../../models/AdminModel");
const crypt = require("../../util/crypt");
const userSession = require("../../models/UserSession");

module.exports = function(app){
    app.post("/admin", async(req,res) => {
        try {
            const{userName, password,invite} = req.body;

            if(!userName || !password || !invite){
                return res.status(401).json({"success": false, "message": "Invalid input"});
            }

            if(invite !== adminInvite){
                return res.status(401).json({"success": false, "message": "Invalid input"});
            }

            const find = await adminUser.find({userName});

            if(find.length>0){
                return res.status(401).json({"success": false, "message": "user name taken"});
            }

            const pass = await crypt.hash(password);

            const admin = new adminUser({
                userName,
                password: pass,
                signDate: new Date()
            });

            await admin.save();

            const session = new userSession({
                auth: "admin",
                userName: userName,
                userId: admin._id
            });

            await session.save();

            return res.json({"success" : true, "message" : "signed in", "token": session.id});

        } catch (error) {
            console.log(error);
            return res.status(500).json({"success": false, "message": "Server error"});
        }
    })
};