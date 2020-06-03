const GMailClient = require('../../Factories/GMailApiFactory');
const SMTPClient = require('../../Factories/SMTPFactory');
const AmazonSesClient = require('../../Factories/AmazonSesFactory');
const Office365Client = require('../../Factories/Office365Factory');
const ServiceTypes = require('../Core/ServiceTypes');

class ServiceClientDeciderService {
    static async decideClientAndSendMails(serviceTypeObject, mailMessages) {
        switch (serviceTypeObject.type) {
            case ServiceTypes.GAUTH:
                return await GMailClient.sendMails(serviceTypeObject, mailMessages);
            case ServiceTypes.CUSTOMSMTP:
                return await SMTPClient.sendMails(serviceTypeObject, mailMessages);
            case ServiceTypes.AMAZONSES:
                return await AmazonSesClient.sendMails(serviceTypeObject, mailMessages);
            case ServiceTypes.OFFICE365:
                return await Office365Client.sendMails(serviceTypeObject, mailMessages);
            default:
                return await GMailClient.sendMails(serviceTypeObject, mailMessages);
        }
    }
}

module.exports = ServiceClientDeciderService;
