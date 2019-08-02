import { Router } from 'express';
import { catchAsync } from '../middlewares/middlewares';
import sessionController from '../controllers/sessionController';

const router = Router();

router.post('/', catchAsync(sessionController.githubAuth));

export default router;
