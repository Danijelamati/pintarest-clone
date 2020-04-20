const fs = require("fs");

module.exports = function(app){
    app.get("/about", (req,res) => {        
        fs.readFile(__dirname+ "../../../../readme.txt", (err,data) => {
            if(err){
                console.log(err);
                return res.status(500).json({"success": false, "message": "Server error"});
            }
            res.json({"success": true, "text": data.toString()});

        });     
    });
};