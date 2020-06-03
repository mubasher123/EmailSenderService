const ProcessingEmailsModel = require('../../Infrastructure/Models/ProcessingEmails');
const MailStackModel = require('../../Infrastructure/Models/MailStack');
const helper = require('../Core/AppHelper');
const ServiceTypes = require('../Core/ServiceTypes');

/**
 *
 * @param stats
 * @returns {Date}
 */
const getProcessingDate = (stats) => {
    let newDate = new Date();
    if (/Daily user sending quota exceeded/ig.test(stats.error)) {
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
    } else if (/Too many login attempts, please try again later/ig.test(stats.error)) {
        newDate.setHours(newDate.getHours() + 2);
    } else if (/Backend Error/ig.test(stats.error)) {
        return newDate;
    } else {
        if (stats.error) {
            newDate.setHours(newDate.getHours() + 1);
        }
    }
    return newDate;
};

class SenderService {

    /**
     *
     * @param mailTypeOptions
     */
    constructor(mailTypeOptions)
    {
        this.type = mailTypeOptions.type;
        this.clientId = mailTypeOptions.clientId;
        this.bunch_size = parseInt(mailTypeOptions.bunch_size);
        this.sender = null;
    }

    /**
     * @param rescheduled
     * @returns {Promise<null|*>}
     */
    async grabSender(rescheduled)
    {
        console.log("new Date(): ", new Date());
        const self = this;
        const sender = await ProcessingEmailsModel.findOneAndUpdate(
            {
                //error: {$in: [null, /Backend Error/ig, /Too many concurrent requests for user/ig, /Rate Limit Exceeded/ig, /Rate Limit Exceeded/ig]},
                client_id: null,
                service_type: self.type,
                process_at: {$lt: new Date()},
                rescheduled: rescheduled
            },
            {
                $set: {client_id: self.clientId}
            },
            {
                new: true
            }
        ).sort({updated_at: 1});
        self.sender = sender;
        if (!!self.sender) {
            self.sender = JSON.parse(JSON.stringify(sender));
            switch (self.type) {
                case ServiceTypes.GAUTH:
                    self.sender.transportDetails.gmail_oauth.client_id = helper.decrypt(self.sender.transportDetails.gmail_oauth.client_id);
                    self.sender.transportDetails.gmail_oauth.client_secret = helper.decrypt(self.sender.transportDetails.gmail_oauth.client_secret);
                    self.sender.transportDetails.gmail_oauth.redirect_uris = helper.decrypt(self.sender.transportDetails.gmail_oauth.redirect_uris);
                    break;
                case ServiceTypes.CUSTOMSMTP:
                    self.sender.transportDetails.auth.pass = helper.decrypt(self.sender.transportDetails.auth.pass);
                    break;
                case ServiceTypes.AMAZONSES:
                    self.sender.transportDetails.amazonses.secret_key = helper.decrypt(self.sender.transportDetails.amazonses.secret_key);
                    break;
                case ServiceTypes.OFFICE365:
                    self.sender.transportDetails.office365.pass = helper.decrypt(self.sender.transportDetails.office365.pass);
                    break;
                default:
                    self.sender.transportDetails.gmail_oauth.client_id = helper.decrypt(self.sender.transportDetails.gmail_oauth.client_id);
                    self.sender.transportDetails.gmail_oauth.client_secret = helper.decrypt(self.sender.transportDetails.gmail_oauth.client_secret);
                    self.sender.transportDetails.gmail_oauth.redirect_uris = helper.decrypt(self.sender.transportDetails.gmail_oauth.redirect_uris);
            }
        }
        if (self.sender === null) {
            throw 'no sender to grab';
        }
        return self.sender;
    }

    /**
     *
     * @param stats
     * @returns {Promise<*>}
     */
    async unGrabSenderAndUpdateSender(stats)
    {

        const processAt = getProcessingDate(stats);
        const self = this;
        return await ProcessingEmailsModel.update({
            client_id: self.clientId,
            sender_email: self.sender.sender_email
        }, {
            $inc: {
                success_count: stats.successCount,
            },
            $set: {client_id: null, error: stats.error, process_at: processAt, rescheduled: true}
        })
    }

    /**
     *
     * @param stats
     * @returns {Promise<*>}
     */
    async removeSender(stats)
    {
        const self = this;
        const regexpEmailId = new RegExp(self.sender.sender_email, 'ig');
        const mailMessage = await MailStackModel.find({
            "mailmsgDetails.from": regexpEmailId,
        })
            .sort({sendAt: 1})
            .limit(1);
        if (!mailMessage.length) {
            return await ProcessingEmailsModel.findOneAndRemove({ sender_email: regexpEmailId, service_type: self.type });
        } else {
            return await this.unGrabSenderAndUpdateSender(stats);
        }
    }
}

module.exports = SenderService;
