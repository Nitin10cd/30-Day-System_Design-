import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

export const authRouter = Router();
authRouter.post('/auth/register', register);
authRouter.post('/auth/login', login);