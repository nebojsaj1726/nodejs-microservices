import { Router } from 'express';
const router = Router();

import { createPayment, getAllPayments } from '../controllers/index.controller';

router.post('/payments', createPayment);
router.get('/payments', getAllPayments);

export default router;
