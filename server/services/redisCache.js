const mongoose = require("mongoose");
const redis = require("redis");
const {promisify} = require("util");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);
client.hget = promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "");
    return this;
};

mongoose.Query.prototype.exec = async function(){
    

    if(!this.useCache){
        console.log("no keš needed");
        return exec.apply(this,arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );


    const cacheValue = await client.hget(this.hashKey, key);

    if(cacheValue){
        console.log("cache");
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? 
        doc.map( dc => new this.model(dc))
        :
        new this.model(doc);
        return doc;
    }
    console.log("no cache");
    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
};

module.exports = {
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
        console.log("cleared cache");
    }
};
