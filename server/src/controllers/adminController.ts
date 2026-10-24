import { Request, Response } from 'express';
import { OrderService } from '../models/Order';
import { ProductService } from '../models/Product';
import { UserService } from '../models/User';
import { loadStore } from '../config/store';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderService.findAll();
    const products = await ProductService.find();
    const store = loadStore();

    // Customers who do not have an @admin.com email
    const registeredCustomers = await UserService.getCustomers();
    const customersCount = registeredCustomers.length;

    // Filter valid sales: payment completed or not cancelled
    const validOrders = orders.filter((o: any) => o.orderStatus !== 'cancelled');

    // Total gross sales & revenue
    const totalSales = validOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    const totalRevenue = totalSales; // Net revenue
    const totalSubtotal = validOrders.reduce((sum: number, o: any) => sum + (Number(o.subtotal) || 0), 0);
    const totalDiscounts = validOrders.reduce((sum: number, o: any) => sum + (Number(o.discount) || 0), 0);

    // Total garments sold count & maps
    let totalGarmentsSold = 0;
    const categorySalesMap: Record<string, { count: number; revenue: number }> = {};
    const productSalesMap: Record<string, { id: string; name: string; image: string; unitsSold: number; revenue: number }> = {};

    validOrders.forEach((ord: any) => {
      (ord.items || []).forEach((item: any) => {
        const qty = Number(item.quantity) || 1;
        const itemTotal = (Number(item.price) || 0) * qty;
        totalGarmentsSold += qty;

        // By product
        const pId = item.productId || item.name;
        if (!productSalesMap[pId]) {
          productSalesMap[pId] = {
            id: pId,
            name: item.name,
            image: item.image,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSalesMap[pId].unitsSold += qty;
        productSalesMap[pId].revenue += itemTotal;
      });
    });

    // Populate category sales using catalog category mapping
    validOrders.forEach((ord: any) => {
      (ord.items || []).forEach((item: any) => {
        const matchedProduct = products.find((p: any) => p._id === item.productId || p.name === item.name);
        const cat = matchedProduct?.category || 'Forest Classics';
        if (!categorySalesMap[cat]) {
          categorySalesMap[cat] = { count: 0, revenue: 0 };
        }
        const qty = Number(item.quantity) || 1;
        categorySalesMap[cat].count += qty;
        categorySalesMap[cat].revenue += (Number(item.price) || 0) * qty;
      });
    });

    const categorySales = Object.entries(categorySalesMap).map(([category, data]) => ({
      category,
      unitsSold: data.count,
      revenue: data.revenue,
      percentage: totalSales > 0 ? Math.round((data.revenue / totalSales) * 100) : 0,
    })).sort((a, b) => b.revenue - a.revenue);

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Average order value
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

    // Payment methods breakdown
    const paymentMethods = {
      razorpay: {
        count: validOrders.filter((o: any) => o.paymentMethod === 'razorpay').length,
        revenue: validOrders.filter((o: any) => o.paymentMethod === 'razorpay').reduce((s: number, o: any) => s + (o.total || 0), 0),
      },
      cod: {
        count: validOrders.filter((o: any) => o.paymentMethod === 'cod').length,
        revenue: validOrders.filter((o: any) => o.paymentMethod === 'cod').reduce((s: number, o: any) => s + (o.total || 0), 0),
      },
    };

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

    // Safe customer preview
    const customerList = registeredCustomers.map((u: any) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      addressesCount: (u.addresses || []).length,
      createdAt: u.createdAt,
    }));

    res.json({
      success: true,
      stats: {
        totalSales,
        totalRevenue,
        totalSubtotal,
        totalDiscounts,
        averageOrderValue,
        totalGarmentsSold,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customersCount,
        customerList,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 10),
        statusCounts,
        categorySales,
        topSellingProducts,
        paymentMethods,
        recentOrders: orders.slice(0, 10),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
