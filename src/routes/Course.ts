import { Router } from 'express';
import CourseController from '../controllers/CourseController';

const router: Router = Router();

router.get('/get-courses', CourseController.getCourses);
router.post('/create-course', CourseController.createCourse);

export default router;