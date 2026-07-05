import { Router } from 'express';
import { createNotification } from '../controllers/notification.controller';

export const notificationRouter = Router();
notificationRouter.post('/notify', createNotification); // notify(n1, e) from the diagram