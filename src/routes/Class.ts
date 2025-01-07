import { Router } from 'express';
import ClassController from '../controllers/ClassController';
import multer from 'multer';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-classes', ClassController.getAllClasses);
router.post('/create-class', ClassController.createClass);
// router.post('/upload-subtopic', upload.single('video'), ClassController.createSubTopic);

export default router;