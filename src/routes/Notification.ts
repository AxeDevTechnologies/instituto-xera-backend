import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';

const router: Router = Router();

router.post('/webhook', NotificationController.setPayment);


export default router;