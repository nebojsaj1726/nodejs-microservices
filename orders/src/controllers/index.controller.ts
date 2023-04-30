import { Request, Response } from 'express';
import { AppDataSource } from '../..';
import { Order } from '../entities/order';
import * as amqp from 'amqplib';

export const createOrder = async (req: Request, res: Response) => {
  const { userId, totalPrice, items } = req.body;

  try {
    const orderRepository = AppDataSource.manager.getRepository(Order);
    const order = orderRepository.create({ userId, totalPrice, items });
    await orderRepository.save(order);

    const amqpConnection = await amqp.connect('amqp://localhost');
    const amqpChannel = await amqpConnection.createChannel();
    const exchangeName = 'user.order';
    const message = JSON.stringify(order);
    amqpChannel.publish(exchangeName, '', Buffer.from(message));

    res.status(201).json({
      message: 'Order added successfully',
      order,
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

export const getOrderById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const orderRepository = AppDataSource.manager.getRepository(Order);
    const order = await orderRepository.findOne({ where: { id } });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const orderRepository = AppDataSource.manager.getRepository(Order);
    const orders = await orderRepository.find({ where: { userId } });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
