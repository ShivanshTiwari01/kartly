import { Request, Response } from 'express';
import Cart from '../../models/cart.model';
import CartItems from '../../models/cartItems.model';
import Product from '../../models/product.model';
import ProductDetails from '../../models/productDetails.model';
import { logger } from '../../app';
import { addCartItemSchema, updateCartItemSchema } from './cart.validation';

const recalculateCartTotal = async (cartId: any): Promise<number> => {
  const items = await CartItems.find({ cartId }).lean();
  let total = 0;
  for (const item of items) {
    const details = await ProductDetails.findOne({
      productId: item.productId,
    }).lean();
    if (details) {
      const price = (details as any).discountedPrice ?? (details as any).price;
      total += price * item.quantity;
    }
  }
  await Cart.findByIdAndUpdate(cartId, { total });
  return total;
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, total: 0 });
    }
    const items = await CartItems.find({ cartId: cart._id })
      .populate({ path: 'productId', select: 'name description summary' })
      .lean();
    return res
      .status(200)
      .json({ success: true, data: { ...cart.toObject(), items } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const parsed = addCartItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const { productId, quantity } = parsed.data;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, total: 0 });
    }

    const existingItem = await CartItems.findOne({
      cartId: cart._id,
      productId,
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItems.create({ cartId: cart._id, productId, quantity });
    }

    const total = await recalculateCartTotal(cart._id);
    return res
      .status(200)
      .json({ success: true, message: 'Item added to cart', data: { total } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;
    const parsed = updateCartItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart not found' });
    }

    const item = await CartItems.findOneAndUpdate(
      { _id: id, cartId: cart._id },
      { quantity: parsed.data.quantity },
      { new: true }
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found' });
    }

    const total = await recalculateCartTotal(cart._id);
    return res
      .status(200)
      .json({
        success: true,
        message: 'Cart item updated',
        data: { item, total },
      });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart not found' });
    }

    const item = await CartItems.findOneAndDelete({
      _id: id,
      cartId: cart._id,
    });
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found' });
    }

    const total = await recalculateCartTotal(cart._id);
    return res
      .status(200)
      .json({
        success: true,
        message: 'Item removed from cart',
        data: { total },
      });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart not found' });
    }
    await CartItems.deleteMany({ cartId: cart._id });
    await Cart.findByIdAndUpdate(cart._id, { total: 0 });
    return res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
