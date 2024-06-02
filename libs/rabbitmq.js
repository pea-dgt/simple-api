const amqp = require("amqplib");

const rabbitmq_connection = (async () => {
  let connection;
  try {
    console.log(`Initializing RabbitMQ`);
    connection = await amqp.connect('amqp://guest:guest@128.199.101.122:5672/dev');
    
    const channel = await connection.createChannel();

    const queue = "my_queue";
    const text = "Hi there!";
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)));
    return connection;
  } catch (error) {
    console.warn(error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
})();

module.exports = rabbitmq_connection;