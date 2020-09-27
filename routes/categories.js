import { Router } from 'express';
import categoriesController from '../controllers/categoriesController';
import catchAsync from '../middlewares/catchAsync';

const router = Router();

router.get('/', catchAsync(categoriesController.findAll));
router.get('/:id', catchAsync(categoriesController.findOne));
router.get('/:id/articles', catchAsync(categoriesController.findCategoryArticles));
router.put('/:id', catchAsync(categoriesController.update));
router.delete('/:id', catchAsync(categoriesController.remove));

export default router;
