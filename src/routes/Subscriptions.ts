import { Router } from 'express';
import SuscriptionsController from '../controllers/SubscriptionsController';

const router: Router = Router();

router.post('/membership-subscription', SuscriptionsController.membershipSubscription);
router.get('/subscribe', SuscriptionsController.getMembershipPaymentURL);

export default router;