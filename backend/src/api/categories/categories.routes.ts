import express from 'express';
import * as controller from './categories.controller';
import authentication from '../../middleware/authentication';
import adminAuth from '../../middleware/adminAuth';

const router = express.Router();

router.get('/', controller.getCategories);
router.get('/:id', controller.getCategoryById);
router.post('/', authentication, adminAuth, controller.createCategory);
router.put('/:id', authentication, adminAuth, controller.updateCategory);
router.delete('/:id', authentication, adminAuth, controller.deleteCategory);

export default router;
