const customSmtp = "custom-smtp";
const gAuth = "gauth";
const sendGrid = "sendgrid";
const amazonSes = "amazonses";
const office365 = "office365";

class ServiceType {
    /**
     *
     * @returns {string}
     * @constructor
     */
    static get CUSTOMSMTP() {
        return customSmtp;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get GAUTH() {
        return gAuth;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get SENDGRID() {
        return sendGrid;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get AMAZONSES() {
        return amazonSes;
    }

    /**
     *
     * @return {string}
     * @constructor
     */
    static get OFFICE365() {
        return office365;
    }
}

module.exports = ServiceType;
