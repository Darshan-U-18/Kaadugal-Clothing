import { Request, Response } from 'express';
import { CouponService } from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Coupon code is required' });
      return;
    }

    const coupon = await CouponService.findByCode(code);
    if (!coupon || !coupon.isActive) {
      res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
      return;
    }

    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      res.status(400).json({ success: false, message: 'This coupon has expired' });
      return;
    }

    if (coupon.minPurchase && Number(cartTotal) < coupon.minPurchase) {
      res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required for coupon ${coupon.code}`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((Number(cartTotal) * coupon.discountAmount) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        discountCalculated: discount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCoupons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await CouponService.findAll();
    res.json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCoupon = await CouponService.create(req.body);
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await CouponService.delete(id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
