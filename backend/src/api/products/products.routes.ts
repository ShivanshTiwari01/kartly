import express from 'express';
import * as controller from './products.controller';
import authentication from '../../middleware/authentication';
import adminAuth from '../../middleware/adminAuth';

const router = express.Router();

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', authentication, adminAuth, controller.createProduct);
router.put('/:id', authentication, adminAuth, controller.updateProduct);
router.delete('/:id', authentication, adminAuth, controller.deleteProduct);

export default router;
