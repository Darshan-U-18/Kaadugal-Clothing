import { Router } from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/', protect, adminOnly, getAllCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
