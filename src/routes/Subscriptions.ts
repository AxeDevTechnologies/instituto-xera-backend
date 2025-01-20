import { Router } from 'express';
import SuscriptionsController from '../controllers/SubscriptionsController';

const router: Router = Router();

router.post('/pay-monthly-subscription', SuscriptionsController.monthlySuscription);

export default router;