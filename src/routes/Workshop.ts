import { Router } from 'express';
import multer from 'multer';
import WorkshopController from '../controllers/WorkshopController';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-workshops', WorkshopController.getWorkshops);
router.get('/get-subtopic', WorkshopController.getSubtopic);
router.get('/get-subtopics', WorkshopController.getSubtopics);
router.post('/create-workshop', WorkshopController.createWorkshop);

export default router;
