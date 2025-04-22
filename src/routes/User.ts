import { Router } from 'express';
import UserController from '../controllers/userController';

const router: Router = Router();

router.get('/get-user', UserController.getUser);
router.get('/get-students', UserController.getStudents);
router.post('/create-user', UserController.createNewUser);
router.post('/set-scholarship', UserController.toggleScholarship);


export default router;