import express from 'express';
import * as controller from './auth.controller';

const router = express.Router();

router.post('/register', controller.register);

router.post('/signin', controller.signin);

export default router;
