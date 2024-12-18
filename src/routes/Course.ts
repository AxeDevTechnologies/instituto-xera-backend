import { Router } from 'express';
import CourseController from '../controllers/CourseController';
import multer from 'multer';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-courses', CourseController.getCourses);
router.post('/create-course', CourseController.createCourse);
router.post('/upload-subtopic', upload.single('video'), CourseController.createSubTopic);

export default router;