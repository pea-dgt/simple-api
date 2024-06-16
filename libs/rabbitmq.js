const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

const mqChannel = (async () => {
  let connection, channel;
  try {
    console.log(`Initializing RabbitMQ`);
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    
    channel = await connection.createChannel();

    const queue = "my_queue";
    await channel.assertQueue(queue, { durable: false });
    
    return channel;
  } catch (error) {
    console.warn(error);
  }
})();

module.exports = mqChannel;