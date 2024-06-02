const amqp = require("amqplib");

const mqChannel = (async () => {
  let connection, channel;
  try {
    console.log(`Initializing RabbitMQ`);
    connection = await amqp.connect('amqp://guest:guest@128.199.101.122:5672/dev');
    
    channel = await connection.createChannel();

    const queue = "my_queue";
    await channel.assertQueue(queue, { durable: false });
    
    return channel;
  } catch (error) {
    console.warn(error);
  }
})();

module.exports = mqChannel;