import { Request, Response } from 'express';
import { ReviewService } from '../models/Review';
import { ProductService } from '../models/Product';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewService.findByProduct(productId);
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required' });
      return;
    }

    const review = await ReviewService.create({
      productId,
      userName: (req.user && req.user.name) || req.body.userName || 'Nature Enthusiast',
      userEmail: (req.user && req.user.email) || req.body.userEmail || 'guest@kaadugal.com',
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: true,
    });

    // Update product rating average
    const allProdReviews = await ReviewService.findByProduct(productId);
    const avgRating =
      allProdReviews.reduce((sum, r) => sum + r.rating, 0) / (allProdReviews.length || 1);

    await ProductService.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(1)),
      numReviews: allProdReviews.length,
    });

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
