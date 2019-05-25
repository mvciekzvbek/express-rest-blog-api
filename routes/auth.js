import { Router } from 'express';
import authController from '../controllers/authController';
import { catchAsync } from "../middlewares/middlewares";

const router = Router();

router.post('/github', catchAsync(authController.githubAuth));

export default router;