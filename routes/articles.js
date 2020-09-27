import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import catchAsync from '../middlewares/catchAsync';
import validateUser from '../middlewares/validateUser';

const router = Router();

/**
 * Retrieves articles
 */
router.get('/', validateUser, catchAsync(articlesController.findAll));

/**
 * Creates new article
 */
router.post('/', validateUser, catchAsync(articlesController.create));

/**
 * Retrieves single article
 */
router.get('/:id', validateUser, catchAsync(articlesController.findOne));

/**
 * Modifies whole article
 */
router.patch('/:id', validateUser, catchAsync(articlesController.update));

/**
 * Modifies fields within an article
 */
router.patch('/:id', validateUser, catchAsync(articlesController.update));

/**
 * Deletes article
 */
router.delete('/:id', validateUser, catchAsync(articlesController.remove));

/**
 * Retrieves comments for given article
 */
router.get(
  '/:id/comments',
  validateUser,
  catchAsync(articlesController.findArticleComments),
);

export default router;
