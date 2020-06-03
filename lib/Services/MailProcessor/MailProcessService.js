const MailStackModel = require('../../Infrastructure/Models/MailStack');
const SentMailModel = require('../../Infrastructure/Models/SentMails');
const mongoose = require('mongoose');

/**
 *
 * @param mailMsg
 * @returns {Promise<*>}
 */
const updateSentMail = async (mailMsg) => {
    return await SentMailModel.update({
        campaign_id: mailMsg.campaign_id,
        campaignitem_id: mailMsg.campaignitem_id,
        email_id: mailMsg.email_id,
        team_id: mailMsg.team_id,
        user_id: mailMsg.user_id
    }, {
        $push: {
            sent: {
                error: [mailMsg.error],
                sent_at: new Date(),
                status: mailMsg.status,
                recipient_email: mailMsg.info.recipientEmail,
                recipient_id: mailMsg.recipient_id,
                thread_id: mailMsg.info.threadId,
                message_id: mailMsg.info.messageId
            }
        }
    }, {
        upsert: true
    });
};

class MailProcessService{

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
     * @param sender
     * @returns {Promise<*>}
     */
    async grabMails(sender)
    {
        const self = this;
        const regexpEmailId = new RegExp(sender.sender_email, 'ig')
        const mails = await MailStackModel.find({
            "mailmsgDetails.from": regexpEmailId,
            sendAt: {$lte: new Date()}
        })
            .sort({updated_at: 1})
            .limit(self.bunch_size);
        if(!mails.length){
            throw 'no mails to grab';
        }
        return mails;
    }

    /**
     *
     * @param stats
     * @returns {Promise<*>}
     */
    async reScheduleMails(stats)
    {
        return await MailStackModel.update({
            _id: {
                $in: stats.errorMailIds.map(id => mongoose.Types.ObjectId(id))
            }
        }, {
            $set: {sendAt: new Date()},//TODO add some delay
            $inc: {attempts: 1},
            $push: {error: stats.error}
        }, {
            multi: true
        });
    }

    /**
     *
     * @param stats
     * @returns {Promise<*>}
     */
    async removeMails(stats)
    {
        const mailsToRemove = stats.successMailIds.concat(stats.maxAttemptMailIds);
        return await MailStackModel.find({
            _id: {
                $in: mailsToRemove.map(id => mongoose.Types.ObjectId(id))
            }
        })
            .remove();
    }

    /**
     *
     * @param sendStatus
     * @returns {Promise<void>}
     */
    async updateSentMailsDB(sendStatus) {
        const self = this;
        const successMails = sendStatus.filter((mailMsg) => {
            return mailMsg.status;
        });
        const maxAttemptMails = sendStatus.filter((mailMsg) => {
            return mailMsg.attempts > 5;
        });
        const mailToUpdate = successMails.concat(maxAttemptMails);
        return await mailToUpdate.map(async(mailMessage) => {
            return await updateSentMail(mailMessage).then((results) => {
                return results;
            })
        });
    }
}

module.exports = MailProcessService;