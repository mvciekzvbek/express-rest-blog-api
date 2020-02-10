import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import { catchAsync, isAuthenticated } from '../middlewares/middlewares';

const router = Router();

/**
 * Retrieves articles
 */
router.get('/', catchAsync(articlesController.findAll));

/**
 * Creates new article
 */
router.post('/', isAuthenticated, catchAsync(articlesController.create));

/**
 * Retrieves single article
 */
router.get('/:id', isAuthenticated, catchAsync(articlesController.findOne));

/**
 * Modifies whole article
 */
router.patch('/:id', isAuthenticated, catchAsync(articlesController.update));

/**
 * Modifies fields within an article
 */
router.patch('/:id', isAuthenticated, catchAsync(articlesController.update));

/**
 * Deletes article
 */
router.delete('/:id', isAuthenticated, catchAsync(articlesController.remove));

/**
 * Retrieves comments for given article
 */
router.get('/:id/comments', isAuthenticated, catchAsync(articlesController.findArticleComments));

export default router;
