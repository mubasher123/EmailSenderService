const log = require('../Infrastructure/Logging/Log');
const NodeMailer = require('nodemailer');
const async = require('async');

const BUNCH_SIZE = 200;

/**
 *
 * @param serviceTypeObject
 * @returns {Promise<void>}
 */
const getTransporter = async (serviceTypeObject) => {
    const transportDetails = serviceTypeObject.sender.transportDetails;
    transportDetails.pool = true;
    transportDetails.maxConnections = BUNCH_SIZE;
    return await NodeMailer.createTransport(transportDetails);
};

class SMTPFactory {
    /**
     *
     * @param serviceTypeObject
     * @param mailMessages
     * @returns {Promise<*>}
     */
    static async sendMails(serviceTypeObject, mailMessages) {
        const transporter = await getTransporter(serviceTypeObject);
        mailMessages = JSON.parse(JSON.stringify(mailMessages));

        return new Promise(function (resolve, reject) {
            async.mapLimit(mailMessages, 3, async (mailMsg) => {
                try {
                    const mailSent = await transporter.sendMail(mailMsg.mailmsgDetails);
                    const successMessage = {
                        status: true,
                        error: null,
                        _id: mailMsg._id,
                        campaign_id: mailMsg.campaign_id,
                        campaignitem_id: mailMsg.campaignitem_id,
                        email_id: mailMsg.email_id,
                        team_id: mailMsg.team_id,
                        user_id: mailMsg.user_id,
                        recipient_id: mailMsg.recipient_id,
                        attempts: mailMsg.attempts,
                        info: {
                            envelope: {
                                to: [mailMsg.mailmsgDetails.to]
                            },
                            threadId: null,
                            messageId: mailSent.messageId
                        }
                    };
                    log.info(successMessage, 'Mail Sent For Details');
                    return successMessage;
                } catch (e) {
                    log.error(e);
                    const errorMessage = {
                        status: false,
                        error: e.message,
                        _id: mailMsg._id,
                        campaign_id: mailMsg.campaign_id,
                        campaignitem_id: mailMsg.campaignitem_id,
                        email_id: mailMsg.email_id,
                        team_id: mailMsg.team_id,
                        user_id: mailMsg.user_id,
                        recipient_id: mailMsg.recipient_id,
                        attempts: mailMsg.attempts,
                        info: {
                            envelope: {
                                to: [mailMsg.mailmsgDetails.to]
                            },
                            threadId: null,
                            messageId: null
                        }

                    };
                    log.error(errorMessage, 'Mail Not Sent For Details');
                    return errorMessage;
                }
            }, function (err, results) {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}
module.exports = SMTPFactory;