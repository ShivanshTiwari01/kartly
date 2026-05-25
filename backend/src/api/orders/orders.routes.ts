import express from 'express';
import * as controller from './orders.controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.get('/', authentication, controller.getOrders);
router.get('/:id', authentication, controller.getOrderById);
router.post('/', authentication, controller.createOrder);
router.put('/:id/cancel', authentication, controller.cancelOrder);

export default router;
