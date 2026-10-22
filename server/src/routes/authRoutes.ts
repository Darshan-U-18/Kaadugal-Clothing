import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getWishlistItems,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlistItems);

export default router;
