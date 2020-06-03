const AWS = require('aws-sdk');
const log = require('../Infrastructure/Logging/Log');
const NodeMailer = require('nodemailer');
const async = require('async');

/**
 *
 * @param serviceTypeObject
 * @returns {Promise<void>}
 */
const getTransporter = async (serviceTypeObject) => {
    const amazonDetails = {
        apiVersion: '2010-12-01',
        accessKeyId: serviceTypeObject.sender.transportDetails.amazonses.access_key,
        secretAccessKey: serviceTypeObject.sender.transportDetails.amazonses.secret_key,
        region: serviceTypeObject.sender.transportDetails.amazonses.region
    };
    return await NodeMailer.createTransport({
        SES: new AWS.SES(amazonDetails)
    });
};

class AmazonSesFactory {
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

module.exports = AmazonSesFactory;