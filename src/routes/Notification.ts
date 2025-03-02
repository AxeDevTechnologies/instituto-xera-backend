import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';

const router: Router = Router();

router.get('/events');
router.post('/monthly-payment', NotificationController.monthlyPayment);
router.post('/subscription-payment', NotificationController.webhooks);


export default router;