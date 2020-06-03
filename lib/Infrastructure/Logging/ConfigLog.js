require('dotenv').config()

const Logger = require('logdna');

var options = {
    app: "funnelbake-emailsender",
    env: "staging" | "production"
};

// const log = Logger.setupDefaultLogger(process.env.IGNESTION_KEY, options);
var logger = Logger.createLogger(process.env.IGNESTION_KEY, options);

module.exports = logger;