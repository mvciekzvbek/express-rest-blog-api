import { Router } from 'express';
import usersController from '../controllers/usersController';
import { catchAsync } from "../middlewares/middlewares";
const router = Router();

router.get('/', catchAsync(usersController.findAll));

router.get('/:id', catchAsync(usersController.findOne));

router.get('/:id/articles', (res, req) => {
})

router.post('/', async (req, res) => {
})

router.post('/fake', catchAsync(usersController.generateFake));

router.put('/:id', catchAsync(usersController.update));

router.delete('/:id', catchAsync(usersController.remove));

export default router;