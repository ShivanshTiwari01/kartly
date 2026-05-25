import express from 'express';
import * as controller from './cart.controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.get('/', authentication, controller.getCart);
router.post('/items', authentication, controller.addCartItem);
router.put('/items/:id', authentication, controller.updateCartItem);
router.delete('/items/:id', authentication, controller.removeCartItem);
router.delete('/', authentication, controller.clearCart);

export default router;
