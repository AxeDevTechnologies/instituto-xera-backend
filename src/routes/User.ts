import { Router } from 'express';
import UserController from '../controllers/userController';

const router: Router = Router();

router.get('/get-user', UserController.getUser);
router.post('/create-user', UserController.createNewUser);


export default router;