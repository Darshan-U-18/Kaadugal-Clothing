import { Request, Response } from 'express';
import { ProductService } from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      subcategory,
      type,
      size,
      color,
      minPrice,
      maxPrice,
      search,
      sort = 'featured',
      inStock,
      page = 1,
      limit = 100,
    } = req.query;

    let products = await ProductService.find();

    // Filter by Category
    if (category && category !== 'all') {
      const catLower = (category as string).toLowerCase().trim();
      products = products.filter((p: any) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pSub = (p.subcategory || '').toLowerCase().trim();
        const pName = (p.name || '').toLowerCase().trim();

        // Women's Collection / Womens / Women
        if (catLower.includes('women')) {
          return pCat.includes('women') || pSub.includes('women') || pCat === 'womens';
        }
        // Men's Collection / Mens / Men
        if (catLower.includes('men')) {
          return (
            (pCat === 'mens' || pCat === 'men' || pSub.includes('men') || pCat.includes('men')) &&
            !pCat.includes('women') &&
            !pSub.includes('women')
          );
        }
        // Kids Collection / Kids / Kid
        if (catLower.includes('kid')) {
          return pCat.includes('kid') || pSub.includes('kid');
        }
        // GenZ Collection / GenZ / Gen-Z
        if (catLower.includes('genz') || catLower.includes('gen-z') || catLower.includes('streetwear')) {
          return (
            pCat.includes('genz') ||
            pCat.includes('gen-z') ||
            pSub.includes('genz') ||
            pSub.includes('gen-z') ||
            pCat.includes('streetwear')
          );
        }
        // Oversized Tees / Tees / T-shirts
        if (catLower.includes('oversized') || catLower.includes('tee') || catLower.includes('t-shirt')) {
          return (
            pCat.includes('tee') ||
            pSub.includes('tee') ||
            pSub.includes('t-shirt') ||
            pName.includes('tee') ||
            pName.includes('t-shirt') ||
            pName.includes('oversized')
          );
        }
        // Everyday Essentials / Basics
        if (catLower.includes('essential') || catLower.includes('basic')) {
          return (
            pCat.includes('essential') ||
            pSub.includes('essential') ||
            pName.includes('essential') ||
            pName.includes('classic') ||
            pName.includes('staple')
          );
        }

        return (
          pCat === catLower ||
          pSub.includes(catLower) ||
          pCat.includes(catLower) ||
          catLower.includes(pCat) ||
          pName.includes(catLower)
        );
      });
    }

    // Filter by Subcategory or Type
    const subFilter = (subcategory || type) as string;
    if (subFilter && subFilter !== 'all') {
      const q = subFilter.toLowerCase().trim();
      products = products.filter((p: any) => {
        const pSub = (p.subcategory || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || []).map((t: string) => t.toLowerCase());

        return (
          pSub.includes(q) ||
          pCat.includes(q) ||
          name.includes(q) ||
          desc.includes(q) ||
          tags.some((t: string) => t.includes(q) || q.includes(t))
        );
      });
    }

    // Filter by Size
    if (size) {
      const s = (size as string).toUpperCase();
      products = products.filter((p: any) =>
        p.sizes && p.sizes.map((sz: string) => sz.toUpperCase()).includes(s)
      );
    }

    // Filter by Color
    if (color) {
      const cLower = (color as string).toLowerCase();
      products = products.filter((p: any) =>
        p.colors && p.colors.some((cl: any) => cl.name.toLowerCase().includes(cLower))
      );
    }

    // Filter by Price range
    if (minPrice) {
      products = products.filter((p: any) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p: any) => p.price <= Number(maxPrice));
    }

    // Filter by In-stock
    if (inStock === 'true') {
      products = products.filter((p: any) => p.stock > 0);
    }

    // Search by name & description & tags
    if (search) {
      const q = (search as string).toLowerCase().trim();
      products = products.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    switch (sort) {
      case 'newest':
        products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        products.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        products.sort((a: any, b: any) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    // Pagination
    const totalCount = products.length;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = limit === 'all' ? (totalCount || 100) : (Number(limit) || 100);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      products: paginatedProducts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    let product = await ProductService.findBySlug(idOrSlug);
    if (!product) {
      product = await ProductService.findById(idOrSlug);
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const current = await ProductService.findById(id);
    const all = await ProductService.find();

    const related = all
      .filter((p: any) => p._id !== id && (p.category === current?.category || p.isBestseller))
      .slice(0, 4);

    res.json({ success: true, products: related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const all = await ProductService.find();
    const catMap: Record<string, number> = {};

    all.forEach((p: any) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    const categories = Object.keys(catMap).map((name) => ({
      name,
      count: catMap[name],
    }));

    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProd = await ProductService.create({
      ...req.body,
      slug: req.body.slug || slug,
    });

    res.status(201).json({ success: true, product: newProd });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await ProductService.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ProductService.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
