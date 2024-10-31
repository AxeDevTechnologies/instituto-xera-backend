import { Router } from 'express';
import UserController from '../controllers/userController';

const router: Router = Router();

router.get('/all-users', UserController.getPeople);
// router.post('/create-user', UserController.newUser);


export default router;