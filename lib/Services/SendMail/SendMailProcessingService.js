const SenderService = require('../MailProcessor/SenderService');
const MailProcessService = require('../MailProcessor/MailProcessService');
const SendMailService = require('../SendMail/SendMailService');
const AppHelper = require('../Core/AppHelper');
const log = require('../../Infrastructure/Logging/Log');


const stats = {
    successCount:0,
    errorMailIds:[],
    successMailIds:[]
};

class SendMailProcessingService
{
    static async startProcess(serviceType, rescheduled = true)
    {
        const senderServiceObject = new SenderService(serviceType);
        try {
            log.info(serviceType, 'Process started with the service');
            const sender = await senderServiceObject.grabSender(rescheduled);
            //set sender to the other services
            serviceType.sender = sender;
            const mailProcessServiceObject = new MailProcessService(serviceType);
            const sendMailServiceObject = new SendMailService(serviceType);
            //now all processes will be on the set sender
            const mails = await mailProcessServiceObject.grabMails(sender);
            const sentStatus = await sendMailServiceObject.sendMails(mails);
            if (sentStatus) {
                const sendStatusStats = AppHelper.getStats(sentStatus);
                await senderServiceObject.unGrabSenderAndUpdateSender(sendStatusStats);
                await mailProcessServiceObject.reScheduleMails(sendStatusStats);
                await mailProcessServiceObject.removeMails(sendStatusStats);
                await mailProcessServiceObject.updateSentMailsDB(sentStatus);

                log.info(serviceType, 'Process finished with the service');
            }
        } catch (e) {
            log.error(e);
            switch(e){
                case 'no sender to grab':
                    break;
                case 'no mails to grab':
                    stats.error = null;
                    await senderServiceObject.removeSender(stats);
                    break;

                default:
                    stats.error = e;
                    await senderServiceObject.unGrabSenderAndUpdateSender(stats);
            }
        }

    }
}

module.exports = SendMailProcessingService;