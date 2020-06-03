const _ = require("lodash");
const Promise = require('bluebird');
const log = require('../Infrastructure/Logging/Log');
const async = require('async');
const { google } = require('googleapis');
const gmail = google.gmail('v1');

const getMessageIdFromResponse = (response) => {
    if (response.status === 200) {
        const payloadHeaders = response.data.payload.headers;
        return _.chain(payloadHeaders).filter(header => {
            return (header.name === "Message-Id")
        }).map(header => { return header.value }).head().value();
    } else {
        return false;
    }
}

/**
 *
 * @param tokens
 * @param oauth2ClientCreds
 * @returns {OAuth2Client}
 */
const getClientAuth = (tokens, oauth2ClientCreds) => {
    const oauth2Client = new google.auth.OAuth2(oauth2ClientCreds.client_id, oauth2ClientCreds.client_secret, oauth2ClientCreds.redirect_uris);
    oauth2Client.credentials = tokens;
    return oauth2Client;
};

/**
 *
 * @param mailMessage
 * @returns {string}
 */
const prepareMail = (mailMessage) => {

    const str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", mailMessage.to, "\n",
        "from: ", mailMessage.from, "\n",
        "subject: ", mailMessage.subject, "\n\n",
        mailMessage.html
    ].join('');
    return new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
};

class GMailApiFactory {
    /**
     *
     * @param serviceTypeObject
     * @param mailMessages
     * @returns {Promise<void>}
     */
    static async sendMails(serviceTypeObject, mailMessages) {
        const MailClient = getClientAuth(serviceTypeObject.sender.transportDetails.gmail.access_creds, serviceTypeObject.sender.transportDetails.gmail_oauth);
        mailMessages = JSON.parse(JSON.stringify(mailMessages));

        return new Promise(function (resolve, reject) {
            async.mapLimit(mailMessages, 3, async (mailMsg) => {
                try {
                    const mailSent = await gmail.users.messages.send({
                        auth: MailClient,
                        userId: 'me',
                        resource: {
                            raw: prepareMail(mailMsg.mailmsgDetails)
                        }
                    });

                    const messageResponse = await gmail.users.messages.get({
                        auth: MailClient,
                        userId: 'me',
                        id: mailSent.data.id,
                        format: "full"
                    });
                    const messageID = getMessageIdFromResponse(messageResponse);
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
                            threadId: mailSent.data.threadId,
                            messageId: messageID.toString()
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

module.exports = GMailApiFactory;