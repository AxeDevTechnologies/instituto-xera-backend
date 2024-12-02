import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import authenticateToken from '../middleware/authenticateToken';

const router: Router = Router();

router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

export default router;