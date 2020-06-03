const ClientDecider = require('../ClientDecider/ServiceClientDeciderService');

class SendMailService
{
    /**
     *
     * @param mailTypeOptions
     */
    constructor(mailTypeOptions)
    {
        this.type = mailTypeOptions.type;
        this.clientId = mailTypeOptions.clientId;
        this.bunch_size = parseInt(mailTypeOptions.bunch_size);
        this.sender = mailTypeOptions.sender;
    }

    /**
     *
     * @param mailMessages
     * @returns {Promise<*>}
     */
    async sendMails(mailMessages)
    {
        const self = this;
        return await ClientDecider.decideClientAndSendMails(self, mailMessages);
    }
}

module.exports = SendMailService;