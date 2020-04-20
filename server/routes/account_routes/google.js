const axios = require("axios");

const UserSession = require("../../models/UserSession");
const {googleUser} = require("../../models/UserModel");
const {googleConfig} = require("../../util/config");

module.exports = function google (app){



    app.get("/account/google/clientid", (req,res) => {

        res.json({"clientID" : googleConfig.clientID});

    });

    app.get("/account/google/signup", async (req,res) => {
        try {

            const {access_token} = req.query;
            
            if(!access_token){
                return res.status(401).json({"success" : false, "message": "invalid signin"});
            }
            
            const getUser = await axios({
                method: "get",
                url: "https://www.googleapis.com/oauth2/v1/userinfo",
                headers : {
                  "Content-Type":"application/json",
                  "Authorization": `Bearer ${access_token}`
                }
              }); 
            
            if(!getUser){
                return res.status(401).json({success : false, "message": "invalid signin"});
            }

            const {data} = getUser;            

            const user = await googleUser.findOne({userName: data.name, googleID: data.id});

            if(user){
          
                const session = new UserSession({
                    auth: "google",
                    userName: user.userName,
                    userId: user._id
                });   
                  
                await session.save();
      
                return res.json({"success" : true, "message": "logging in ", "token": session.id});
            }

            const newUser = new googleUser({
                userName: data.name,
                googleID: data.id,
                signDate: new Date
            });
      
            await newUser.save();
      
            const newSession = new UserSession({
                userId: newUser.id,
                isLogedIn: true,
                userName: newUser.userName,
                auth: "google"
            });
      
            await newSession.save();
              
            return res.json({success: true, "message": "user signed", "userName": newSession.userName, "token": newSession.id});

        } catch (error) {
            console.log(error);
            return res.status(500).json({success: "false", message:"server error"});
        }
    });

};