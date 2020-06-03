const log = require('../Infrastructure/Logging/Log');
const NodeMailer = require('nodemailer');
const async = require('async');
const HOST = 'smtp.office365.com';
const PORT = 587;
const CIPHERS = 'SSLv3';
/**
 *
 * @param serviceTypeObject
 * @returns {Promise<void>}
 */
const getTransporter = async (serviceTypeObject) => {
    const office365Details = {
        host: HOST,
        port: PORT,
        auth: {
            user: serviceTypeObject.sender.office365.username,
            pass: serviceTypeObject.sender.office365.pass
        },
        tls: {
            ciphers: CIPHERS
        }
    };
    return await NodeMailer.createTransport(office365Details);
};

class Office365Factory {
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

module.exports = Office365Factory;
