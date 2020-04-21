const bcrypt = require("bcryptjs");

module.exports.hash = async (password) => {

    return await bcrypt.hash(password, parseInt(13,10));    
           
};

module.exports.compare = async (password,hash) => {
    
    return await bcrypt.compare(password,hash);
    
};