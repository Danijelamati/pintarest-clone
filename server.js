const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

require('dotenv').config({ path: "./.env" });
require("./server/services/redisCache");

const apiRoutes = require("./server/routes/routes");

const app = express();

app.use(helmet({
    frameguard: {        
      action: 'deny'
    },
    contentSecurityPolicy: {    
      directives: {
        defaultSrc: ["'self'"]
      }
    },
    dnsPrefetchControl: false     
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true , useUnifiedTopology: true }, (err) => {
    if(err){
        console.log(err);
        res.send("Server error");
    }
    console.log("Connection successfull");
});

apiRoutes(app);

app.use((req,res,next) => {
    res.json({"success": false, "message": "404 not found"})
        .status(404);
});


const port = 5000;

app.listen(port, () => {
    console.log(`Server starting on port ${port}`);
});

