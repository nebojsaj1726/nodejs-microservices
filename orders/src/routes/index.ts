import { Router } from 'express';
const router = Router();

import {
  createOrder,
  getOrderById,
  getAllOrders,
} from '../controllers/index.controller';

router.post('/orders', createOrder);
router.get('/orders/user/:userId', getAllOrders);
router.get('/orders/:id', getOrderById);

export default router;
