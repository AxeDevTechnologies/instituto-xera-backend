import { Router } from 'express';
import ClassController from '../controllers/ClassController';
import multer from 'multer';
import authenticateToken from '../middleware/authenticateToken';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-classes', ClassController.getAllClasses);
router.get('/get-teacher-classes', ClassController.getClassesForTeacher);
router.get('/get-class-video', authenticateToken, ClassController.getURLClass);

router.post('/create-class', authenticateToken, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), ClassController.createClass);

router.patch('/edit-class/:classId', authenticateToken, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), ClassController.editClass);

router.delete('/delete-class/:classId', authenticateToken, ClassController.deleteClass);

export default router;