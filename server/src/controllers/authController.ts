import { Request, Response } from 'express';
import { UserService } from '../models/User';
import { generateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { ProductService } from '../models/Product';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await UserService.findOneByEmail(cleanEmail);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const assignedRole = cleanEmail.endsWith('@admin.com') ? 'admin' : 'customer';

    const user = await UserService.create({
      name,
      email: cleanEmail,
      password,
      role: assignedRole,
    });

    const token = generateToken(String(user._id), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await UserService.findOneByEmail(cleanEmail);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await UserService.comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Enforce that only accounts ending with @admin.com have admin role
    const shouldBeAdmin = cleanEmail.endsWith('@admin.com');
    if (shouldBeAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await UserService.updateById(user._id, { role: 'admin' });
    } else if (!shouldBeAdmin && user.role === 'admin') {
      user.role = 'customer';
      await UserService.updateById(user._id, { role: 'customer' });
    }

    const token = generateToken(String(user._id), user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const updated = await UserService.updateById(req.user._id, { name });
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const newAddress = {
      _id: 'addr_' + Date.now(),
      ...req.body,
    };
    const currentAddresses = req.user.addresses || [];
    if (newAddress.isDefault) {
      currentAddresses.forEach((a: any) => (a.isDefault = false));
    }
    const updatedAddresses = [...currentAddresses, newAddress];
    const updated = await UserService.updateById(req.user._id, { addresses: updatedAddresses });
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;
    const currentAddresses = (req.user.addresses || []).filter((a: any) => a._id !== addressId);
    const updated = await UserService.updateById(req.user._id, { addresses: currentAddresses });
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    let wishlist: string[] = req.user.wishlist || [];

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }

    const updated = await UserService.updateById(req.user._id, { wishlist });
    res.json({ success: true, wishlist: updated.wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlistItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const wishlistIds = req.user.wishlist || [];
    const allProducts = await ProductService.find();
    const products = allProducts.filter((p: any) => wishlistIds.includes(p._id));
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
