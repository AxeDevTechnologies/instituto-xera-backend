import { Router } from 'express';
import StoreController from '../controllers/StoreController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router: Router = Router();
router.post('/create-product', upload.fields([
    { name: 'image', maxCount: 1 }
]), StoreController.createProduct);

router.get('/get-products', StoreController.getProducts);

export default router;