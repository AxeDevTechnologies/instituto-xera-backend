import { Router } from 'express';
import ClassController from '../controllers/ClassController';
import multer from 'multer';
import authenticateToken from '../middleware/authenticateToken';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-classes', ClassController.getAllClasses);
router.get('/get-class-video', authenticateToken, ClassController.getURLClass);
router.post('/create-class', authenticateToken, upload.single('video'), ClassController.createClass);

export default router;