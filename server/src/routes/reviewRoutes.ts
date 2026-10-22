import { Router } from 'express';
import { getReviewsByProduct, createReview } from '../controllers/reviewController';

const router = Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/', createReview);

export default router;
