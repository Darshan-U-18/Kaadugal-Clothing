import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getProductByIdOrSlug);
router.get('/:id/related', getRelatedProducts);

// Admin-only routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
