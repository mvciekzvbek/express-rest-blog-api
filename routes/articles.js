import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import { catchAsync } from "../middlewares/middlewares";

const router = Router();

router.get('/', catchAsync(articlesController.findAll));

router.get('/:id', catchAsync(articlesController.findOne));

router.post('/', catchAsync(articlesController.create));

router.put('/:id', catchAsync(articlesController.update));

router.delete('/:id', catchAsync(articlesController.remove))

export default router;