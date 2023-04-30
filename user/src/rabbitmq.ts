import * as amqp from 'amqplib';
import { AppDataSource } from '..';
import { User } from './entities/user';

const createExchangeAndQueue = async (
  exchangeName: string,
  queueName: string,
) => {
  const amqpConnection = await amqp.connect('amqp://localhost');
  const amqpChannel = await amqpConnection.createChannel();

  await amqpChannel.assertExchange(exchangeName, 'fanout', { durable: true });
  const { queue } = await amqpChannel.assertQueue(queueName, {
    exclusive: false,
  });

  await amqpChannel.bindQueue(queue, exchangeName, '');

  return { amqpChannel, queue };
};

export const listenToOrderExchange = async () => {
  const { amqpChannel, queue } = await createExchangeAndQueue(
    'user.order',
    'user.order.queue',
  );

  amqpChannel.consume(
    queue,
    async (message) => {
      if (!message) {
        return;
      }

      const order = JSON.parse(message.content.toString());
      const userId = order.userId;

      console.log(`Received order ${order.id} for user ${userId}`);

      const userRepository = AppDataSource.manager.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        console.error(`User ${userId} not found`);
        return;
      }

      user.orders.push({
        id: order.id,
        userId: order.userId,
        totalPrice: order.totalPrice,
        items: order.items,
      });

      await userRepository.save(user);

      console.log(`User ${userId} updated`);
    },
    { noAck: true },
  );
};

export const listenToPaymentExchange = async () => {
  const { amqpChannel, queue } = await createExchangeAndQueue(
    'user.payment',
    'user.payment.queue',
  );

  amqpChannel.consume(
    queue,
    async (message) => {
      if (!message) {
        return;
      }

      const payment = JSON.parse(message.content.toString());
      const userId = payment.userId;

      console.log(`Received payment ${payment.id} for user ${userId}`);

      const userRepository = AppDataSource.manager.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        console.error(`User ${userId} not found`);
        return;
      }

      user.payments.push({
        id: payment.id,
        userId: payment.userId,
        orderIds: payment.orderIds,
        totalAmount: payment.totalAmount,
        paymentDate: payment.paymentDate,
      });

      await userRepository.save(user);

      console.log(`User ${userId} updated`);
    },
    { noAck: true },
  );
};
