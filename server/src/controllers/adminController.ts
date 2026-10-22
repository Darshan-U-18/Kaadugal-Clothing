import { Request, Response } from 'express';
import { OrderService } from '../models/Order';
import { ProductService } from '../models/Product';
import { loadStore } from '../config/store';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderService.findAll();
    const products = await ProductService.find();
    const store = loadStore();
    const customersCount = store.users.filter((u) => u.role !== 'admin').length;

    // Calculate total revenue from paid/completed or active orders
    const completedOrders = orders.filter((o: any) => o.paymentStatus === 'completed' || o.orderStatus !== 'cancelled');
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    // Low stock items
    const lowStockProducts = products.filter((p: any) => p.stock <= 15);

    // Status counts
    const statusCounts = {
      ordered: orders.filter((o: any) => o.orderStatus === 'ordered').length,
      processing: orders.filter((o: any) => o.orderStatus === 'processing').length,
      shipped: orders.filter((o: any) => o.orderStatus === 'shipped').length,
      delivered: orders.filter((o: any) => o.orderStatus === 'delivered').length,
      cancelled: orders.filter((o: any) => o.orderStatus === 'cancelled').length,
    };

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customersCount || 12,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 5),
        statusCounts,
        recentOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
