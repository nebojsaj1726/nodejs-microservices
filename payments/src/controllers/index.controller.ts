import { Request, Response } from 'express';
import { AppDataSource } from '../..';
import { Payment } from '../entities/payment';
import * as amqp from 'amqplib';

export const createPayment = async (req: Request, res: Response) => {
  const { userId, orderIds, totalAmount } = req.body;

  try {
    const paymentRepository = AppDataSource.manager.getRepository(Payment);
    const payment = paymentRepository.create({
      userId,
      orderIds,
      totalAmount,
      paymentDate: new Date(),
    });
    await paymentRepository.save(payment);

    const amqpConnection = await amqp.connect('amqp://localhost');
    const amqpChannel = await amqpConnection.createChannel();
    const exchangeName = 'user.payment';
    const message = JSON.stringify(payment);
    amqpChannel.publish(exchangeName, '', Buffer.from(message));

    res.status(201).json({
      message: 'Payment added successfully',
      payment,
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'QueryFailedError') {
      res.status(400).json({
        error: 'Validation error: ' + error.message,
      });
    } else {
      res.status(500).send('Internal server error');
    }
  }
};

export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const paymentRepository = AppDataSource.manager.getRepository(Payment);
    const payments = await paymentRepository.find();

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
