const logger = require('../Logging/ConfigLog');

class LogService {
    static info(message, metaData) {
        if (typeof message === 'string') {
            logger.log(`${message}`, { level: 'Info', app: 'funnelbake-emailsender', meta: metaData });
        } else if (typeof metaData === 'string') {
            logger.log(`${metaData}`, { level: 'Info', app: 'funnelbake-emailsender', meta: message });
        }
    }

    static error(message, metaData) {
        if (typeof message === 'string') {
            logger.log(`${message}`, { level: 'Info', app: 'funnelbake-emailsender', meta: metaData });
        } else if (typeof metaData === 'string') {
            logger.log(`${metaData}`, { level: 'Info', app: 'funnelbake-emailsender', meta: message });
        }
    }
}

module.exports = LogService;