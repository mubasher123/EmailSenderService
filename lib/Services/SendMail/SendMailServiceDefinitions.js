const config = require("../../../config");

class SendMailServiceDefinitions {

    static get GMAIL(){
        return config.gmail;
    }

    static get CUSTOM(){
        return config.smtp;
    }

    static get AMAZONSES(){
        return config.amazonses;
    }

    static get SENDGRID(){
        return config.gmail;
    }

    static get OFFICE365(){
        return config.office365;
    }
}

module.exports = SendMailServiceDefinitions;
