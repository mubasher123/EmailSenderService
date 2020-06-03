const RabbitMQ = require('../Infrastructure/RabbitMQ/RabbitMQ');
const log = require('../Infrastructure/Logging/Log');
const SendMailProcessingService = require('./SendMail/SendMailProcessingService');
const SendMailServiceDefinitions = require('./SendMail/SendMailServiceDefinitions');
const rabbitMQDetails = {
    queueName: 'gauthsmtp.q',
    exchangeName: 'smtp',
    exchangeType: 'direct',
    routingKey: 'g-oauth',
    queueOptions: { durable: true },
    consumerTag: 'gauth-client-1' //same as clientId
};


class Consumer {
    /**
     *
     * @returns {Promise<void>}
     */
    static async initializeConsumer() {
        const queueName = rabbitMQDetails.queueName;
        const exchangeName = rabbitMQDetails.exchangeName;
        const exchangeType = rabbitMQDetails.exchangeType;
        const routingKey = rabbitMQDetails.routingKey;
        const queueOptions = rabbitMQDetails.queueOptions;

        const channel = await RabbitMQ.getChannel(exchangeName, exchangeType);
        await channel.assertQueue(queueName, queueOptions);
        await channel.bindQueue(queueName, exchangeName, routingKey, {});
        channel.prefetch(1);
        channel.consume(queueName, async function (msg) {
            try {
                await SendMailProcessingService.startProcess(SendMailServiceDefinitions.GMAIL, false);
                await SendMailProcessingService.startProcess(SendMailServiceDefinitions.CUSTOM, false);
                await SendMailProcessingService.startProcess(SendMailServiceDefinitions.AMAZONSES, false);
                await SendMailProcessingService.startProcess(SendMailServiceDefinitions.OFFICE365, false);
                await channel.ack(msg);
            } catch (e) {
                log.error(e);
            }

        });
    }
}

module.exports = Consumer;

