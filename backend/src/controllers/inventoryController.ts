import { Request, Response } from 'express';
import { prisma } from '../index';

export const createMovement = async (req: Request, res: Response) => {
  try {
    const { productId, type, quantity, note } = req.body as any;

    if (!productId || !type || quantity === undefined) {
      return res.status(400).json({ error: 'productId, type and quantity are required' });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || Math.abs(qty) > 1000000) {
      return res.status(400).json({ error: 'Quantity must be an integer within a reasonable range' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate new stock
    let delta = 0;
    if (type === 'IN') delta = qty;
    else if (type === 'OUT') delta = -qty;
    else if (type === 'ADJUST') delta = qty; // adjustment can be positive or negative
    else return res.status(400).json({ error: 'Invalid movement type' });

    const newStock = Math.max(0, (product.stock ?? 0) + delta);

    const [movement, updated] = await prisma.$transaction([
      prisma.inventoryMovement.create({
        data: { productId, type, quantity: qty, note }
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock, inStock: newStock > 0 }
      })
    ]);

    res.status(201).json({ success: true, data: { movement, product: updated } });
  } catch (error: any) {
    console.error('Create movement error:', error);
    res.status(500).json({ error: 'Failed to create movement', details: error.message });
  }
};

export const listMovements = async (req: Request, res: Response) => {
  try {
    const { productId, page = 1, limit = 20 } = req.query as any;

    const where: any = {};
    if (productId) where.productId = String(productId);

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [movements, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { product: { select: { id: true, name: true } } }
      }),
      prisma.inventoryMovement.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        movements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / take)
        }
      }
    });
  } catch (error: any) {
    console.error('List movements error:', error);
    res.status(500).json({ error: 'Failed to list movements', details: error.message });
  }
};



