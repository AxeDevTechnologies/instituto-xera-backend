import { Router } from 'express';
import CourseController from '../controllers/CourseController';

const router: Router = Router();

router.get('/get-course');
router.post('/create-course', CourseController.createCourse);

export default router;