import { Router } from 'express';
import ClassController from '../controllers/ClassController';
import multer from 'multer';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-classes', ClassController.getAllClasses);
router.get('/get-class-video', ClassController.getURLClass);
router.post('/create-class', upload.single('video'), ClassController.createClass);

export default router;