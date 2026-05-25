import { Request, Response } from 'express';
import Wishlist from '../../models/wishlist.model';
import Product from '../../models/product.model';
import { logger } from '../../app';

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const wishlist = await Wishlist.find({ userId })
      .populate('productId', 'name description summary')
      .lean();
    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: 'Product already in wishlist' });
    }

    const item = await Wishlist.create({ userId, productId });
    return res
      .status(201)
      .json({ success: true, message: 'Added to wishlist', data: item });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { productId } = req.params;

    const item = await Wishlist.findOneAndDelete({ userId, productId });
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Item not found in wishlist' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
