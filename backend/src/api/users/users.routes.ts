import express from 'express';
import * as controller from './users.controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.get('/me', authentication, controller.getProfile);
router.put('/me', authentication, controller.updateProfile);
router.get('/me/addresses', authentication, controller.getAddresses);
router.post('/me/addresses', authentication, controller.createAddress);
router.put('/me/addresses/:id', authentication, controller.updateAddress);
router.delete('/me/addresses/:id', authentication, controller.deleteAddress);

export default router;
