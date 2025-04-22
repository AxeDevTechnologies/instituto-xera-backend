import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';

const router: Router = Router();

router.get('/events');
router.post('/monthly-payment', NotificationController.monthlyPayment);
router.post('/subscription-payment', NotificationController.webhooks);
router.post('/buy-workshop', NotificationController.webhookWorkshop);


export default router;