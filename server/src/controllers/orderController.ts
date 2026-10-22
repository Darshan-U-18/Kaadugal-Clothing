import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { OrderService } from '../models/Order';
import { ProductService } from '../models/Product';
import { CouponService } from '../models/Coupon';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;
if (razorpayKeyId && razorpayKeySecret) {
  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      shippingAddress,
      shippingMethod = 'standard',
      couponCode,
      paymentMethod = 'razorpay',
    } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ success: false, message: 'Cart items are required' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.postalCode) {
      res.status(400).json({ success: false, message: 'Complete shipping address is required' });
      return;
    }

    // Verify stock and compute subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await ProductService.findById(item.productId);
      if (!prod) {
        res.status(400).json({ success: false, message: `Product ${item.name} not found` });
        return;
      }

      if (prod.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${prod.name}. Available: ${prod.stock}`,
        });
        return;
      }

      const itemTotal = prod.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: prod._id,
        name: prod.name,
        image: item.image || (prod.images && prod.images[0]) || '',
        price: prod.price,
        quantity: item.quantity,
        size: item.size || 'M',
        color: item.color || (prod.colors && prod.colors[0]?.name) || 'Forest Green',
      });
    }

    // Calculate coupon discount
    let discount = 0;
    if (couponCode) {
      const coupon = await CouponService.findByCode(couponCode);
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountAmount) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountAmount;
        }
        await CouponService.incrementUsage(couponCode);
      }
    }

    // Shipping fee
    const shippingFee = shippingMethod === 'express' ? 150 : (subtotal > 1500 ? 0 : 99);
    // 5% GST included or added transparently
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = Math.max(0, subtotal - discount + shippingFee + tax);

    // Create Order Record
    const order = await OrderService.create({
      userId: req.user ? req.user._id : undefined,
      customerEmail: (req.user && req.user.email) || shippingAddress.email || 'customer@kaadugal.com',
      customerName: (req.user && req.user.name) || shippingAddress.fullName,
      items: validatedItems,
      shippingAddress,
      shippingMethod,
      subtotal,
      discount,
      tax,
      shippingFee,
      total,
      couponCode: discount > 0 ? couponCode : undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'ordered',
    });

    // Deduct stock
    for (const item of items) {
      const prod = await ProductService.findById(item.productId);
      if (prod) {
        await ProductService.findByIdAndUpdate(prod._id, {
          stock: Math.max(0, prod.stock - item.quantity),
        });
      }
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, receipt } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: 'Amount is required' });
      return;
    }

    // Amount in paise
    const amountInPaise = Math.round(amount * 100);

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rec_${Date.now()}`,
      };
      const razorpayOrder = await razorpayInstance.orders.create(options);
      res.json({
        success: true,
        isSandboxLive: true,
        key: razorpayKeyId,
        order: razorpayOrder,
      });
      return;
    }

    // Sandbox / Test Mode fallback when API credentials are not yet configured
    const simulatedOrderId = 'order_test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    res.json({
      success: true,
      isSandboxLive: false,
      isTestSimulation: true,
      message: 'Razorpay Test Simulation Active (Configure RAZORPAY_KEY_ID in .env for live test API)',
      order: {
        id: simulatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rec_${Date.now()}`,
        status: 'created',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (razorpayKeySecret && razorpaySignature) {
      const hmac = crypto.createHmac('sha256', razorpayKeySecret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        res.status(400).json({ success: false, message: 'Invalid payment signature verification' });
        return;
      }
    }

    // Update order status
    const updated = await OrderService.updateStatus(orderId, 'processing', 'completed');
    if (updated) {
      updated.razorpayOrderId = razorpayOrderId;
      updated.razorpayPaymentId = razorpayPaymentId;
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      order: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await OrderService.findByUserId(req.user._id);
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await OrderService.findByIdOrNumber(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderService.findAll();
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updated = await OrderService.updateStatus(id, orderStatus, paymentStatus);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
