import { Router } from 'express';
const router = Router();

import { getUser, createUser } from '../controllers/index.controller';

router.get('/users/:id', getUser);
router.post('/users', createUser);

export default router;
