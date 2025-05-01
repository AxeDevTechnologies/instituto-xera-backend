import { Router } from 'express';
import multer from 'multer';
import WorkshopController from '../controllers/WorkshopController';
import authenticateToken from '../middleware/authenticateToken';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-workshops', WorkshopController.getWorkshops);
router.get('/get-subtopic', WorkshopController.getSubtopic);
router.get('/get-subtopics', WorkshopController.getSubtopics);

router.post('/create-workshop', authenticateToken, upload.fields([
    { name: 'image', maxCount: 1 }
]), WorkshopController.createWorkshop);

router.post('/create-subtopic', authenticateToken, upload.fields([
    { name: 'video', maxCount: 1},
]), WorkshopController.createSubTopic);
router.post('/create-checkout-session-workshop', WorkshopController.buyWorksop);

router.delete('/delete-workshop/:workshopId', authenticateToken, WorkshopController.deleteWorkshop);

router.delete('/subtopic/:id', authenticateToken, WorkshopController.deleteSubtopic);

router.get('/video/subtopic', authenticateToken, WorkshopController.getURLSubtopic);

export default router;
