import { Router } from 'express';
import SubscriptionsController from '../controllers/SubscriptionsController';

const router: Router = Router();

router.get('/price-list', SubscriptionsController.getAllPrices);
router.get('/product-list', SubscriptionsController.getProductList);
router.get('/retrieve-subscription', SubscriptionsController.retrieveSubscription);
router.get('/retrieve-customer', SubscriptionsController.getCustomer);
router.get('/retrieve-product', SubscriptionsController.retrieveProduct);
router.get('/subscription-list', SubscriptionsController.getAllSubscriptions);

// * POST METHOD
router.post('/subscribe', SubscriptionsController.createSubscription);

export default router;