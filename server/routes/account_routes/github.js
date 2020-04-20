const axios = require("axios");

const UserSession = require("../../models/UserSession");
const {githubUser} = require("../../models/UserModel");
const {githubConfig} = require("../../util/config");


module.exports = function(app){


    app.get("/account/github/clientid", (req,res)=>{
      
      return res.json({"clientID": githubConfig.clientID});

    });
    
    app.get("/account/github/signup",async(req,res)=>{

      try{
        const {code} = req.query;       
        
        if(!code){
          return res.status(401).json({"success" : false, "message": "invalid signin"});
        }

        const getToken = await axios({
          method: "get",
          url: "https://github.com/login/oauth/access_token",
          headers : {"Content-Type":"application/json"},
          data: {
            code,
            client_id: githubConfig.clientID,
            client_secret: githubConfig.clientSecret 
          } 
        });
        
        const accessToken = getToken.data.split(/[=&]/g)[1];
        
        if(!accessToken){
          return res.status(401).json({"success" : false, "message": "invalid signin"});
        }
            
        const getUser = await axios({
          method: "get",
          url: "https://api.github.com/user",
          headers : {
            "Content-Type":"application/json",
            "Authorization": `token ${accessToken}`
          }
        });        

        if(!getUser){
          return res.status(401).json({success : false, "message": "invalid signin"});
        }

        const {data} = getUser; 

        const user = await githubUser.findOne({userName: data.login, githubID: data.id});
        
        if(user){
          
          const session = new UserSession({
            userId: user.id,
            userName: user.userName,
            auth: "github"
          });    
            
          await session.save();

          return res.json({success : true, "message": "logging in ", "token": session.id});
        }

        
        const newUser = new githubUser({
          userName: data.login,
          githubID: data.id,
          signDate: new Date
        });

        await newUser.save();

        const newSession = new UserSession({
          userId: newUser.id,
          isLogedIn: true,
          userName: newUser.userName,
          auth: "github"
        });

        await newSession.save();
        
        return res.json({success: true, "message": "user signed", "userName": newSession.userName, "token": newSession.id});
        
      }
      catch(err){
        console.log(err);
        return res.status(500).json({success: "false", message:"server error"});
      }
        


    });       

    
};