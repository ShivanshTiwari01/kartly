import express from 'express';
import * as controller from './orders.controller';
import authentication from '../../middleware/authentication';
import adminAuth from '../../middleware/adminAuth';

const router = express.Router();

router.get('/', authentication, adminAuth, controller.adminGetOrders);
router.put('/:id', authentication, adminAuth, controller.adminUpdateOrder);

export default router;
