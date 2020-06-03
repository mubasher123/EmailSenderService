const rabbit = require('amqplib');
const server = process.env.RABBITMQ_CONN_URL;
const _channel = {};

/**
 *
 * @param {Channel} channel
 * @param {String} exchangeName
 * @param {String} exchangeType
 * @returns {Promise<void>}
 */
const assertExchange = async (channel, exchangeName, exchangeType) => {
    try {
        await channel.checkExchange(exchangeName);
    } catch (e) {
        await channel.assertExchange(exchangeName, exchangeType);
    }
};

class RabbitMq {

    /**
     *
     * @param exchangeName
     * @param exchangeType
     * @returns {Promise<Channel>}
     */
    static async getChannel(exchangeName, exchangeType) {
        if (typeof _channel[exchangeName] !== 'undefined') {
            return _channel[exchangeName];
        } else {
            const rabbitMqConn = await rabbit.connect(server);
            const channel = await rabbitMqConn.createChannel();
            await assertExchange(channel, exchangeName, exchangeType);
            _channel[exchangeName] = channel;
            return channel;
        }

    }
}


module.exports = RabbitMq;