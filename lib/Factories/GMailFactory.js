const NodeMailer = require('nodemailer');
const Promise = require('bluebird');
const log = require('../Infrastructure/Logging/Log');

const HOST = 'smtp.gmail.com';
const PORT = 465;
const TYPE = 'OAuth2';
const SECURE = true;

/**
 *
 * @param mailDetails
 * @param serviceTypeObject
 * @returns {{from: *, to: *, subject: string, html: *, auth: {user: *, refreshToken: string, accessToken: string, expires: *}}}
 */
const prepareMail = (mailDetails, serviceTypeObject) => {
    return {
        from: mailDetails.from,
        to: mailDetails.to,
        subject: mailDetails.subject,
        generateTextFromHTML: true,
        html: mailDetails.html,
        auth: {
            user: serviceTypeObject.sender.transportDetails.gmail.username,
            refreshToken: serviceTypeObject.sender.transportDetails.gmail.access_creds.refresh_token,
            accessToken: serviceTypeObject.sender.transportDetails.gmail.access_creds.access_token,
            expires: parseInt(serviceTypeObject.sender.transportDetails.gmail.access_creds.expiry_date)
        }
    }
};

class GMailFactory {
    /**
     *
     * @param serviceTypeObject
     * @param mailMessages
     * @returns {Promise<*>}
     */
    static async sendMails(serviceTypeObject, mailMessages) {
        const transporter = NodeMailer.createTransport({
            host: HOST,
            port: PORT,
            secure: SECURE,
            auth: {
                type: TYPE,
                clientId: serviceTypeObject.sender.transportDetails.gmail_oauth.client_id,
                clientSecret: serviceTypeObject.sender.transportDetails.gmail_oauth.client_secret
            },
            logger: false,

        });
        transporter.on('token', token => {
            console.log('A new access token was generated');
            console.log('User: %s', token.user);
            console.log('Access Token: %s', token.accessToken);
            console.log('Expires: %s', new Date(token.expires));
        });
        mailMessages = JSON.parse(JSON.stringify(mailMessages));
        const mailRequests = mailMessages.map(async function (mailMsg) {
            try {
                const messageToSend = prepareMail(mailMsg.mailmsgDetails, serviceTypeObject);
                const mailSent = await transporter.sendMail(messageToSend);
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
                        envelope: mailSent.envelope,
                        threadId: null,
                        messageId: null
                    }
                };
                log.info(successMessage, 'Mail Sent For Details');
                return successMessage;
            } catch (e) {
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
        });
        return await Promise.all(mailRequests);
    }
}

module.exports = GMailFactory;