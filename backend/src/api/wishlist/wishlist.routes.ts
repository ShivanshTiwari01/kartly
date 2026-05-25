import express from 'express';
import * as controller from './wishlist.controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.get('/', authentication, controller.getWishlist);
router.post('/', authentication, controller.addToWishlist);
router.delete('/:productId', authentication, controller.removeFromWishlist);

export default router;
