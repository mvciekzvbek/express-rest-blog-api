import { Router } from 'express';
import commentsController from '../controllers/commentsController';
import catchAsync from '../middlewares/catchAsync';

const router = Router();

router.get('/', catchAsync(commentsController.findAll));

router.get('/:id', catchAsync(commentsController.findOne));

router.put('/:id', catchAsync(commentsController.update));

router.delete('/:id', catchAsync(commentsController.remove));

export default router;
