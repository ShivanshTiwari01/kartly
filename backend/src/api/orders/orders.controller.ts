import { Request, Response } from 'express';
import OrderDetails from '../../models/orderDetails.model';
import OrderItems from '../../models/orderItems.model';
import Cart from '../../models/cart.model';
import CartItems from '../../models/cartItems.model';
import Product from '../../models/product.model';
import ProductDetails from '../../models/productDetails.model';
import UserProfile from '../../models/userProfile.model';
import UserAddress from '../../models/userAddress.model';
import { logger } from '../../app';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from './orders.validation';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const orders = await OrderDetails.find({ userId })
      .populate('addressId')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;
    const order = await OrderDetails.findOne({ _id: id, userId })
      .populate('addressId')
      .lean();
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    const items = await OrderItems.find({ orderId: id }).lean();
    return res.status(200).json({ success: true, data: { ...order, items } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const { addressId, paymentMethod } = parsed.data;

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'User profile not found. Please set up your profile first.',
        });
    }

    const address = await UserAddress.findOne({
      _id: addressId,
      userProfileId: profile._id,
    });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const cartItems = await CartItems.find({ cartId: cart._id }).lean();
    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let total = 0;
    const orderItemsData: Array<{
      productId: any;
      productName: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId).lean();
      const details = await ProductDetails.findOne({
        productId: item.productId,
      }).lean();
      if (!product || !details) continue;
      const price = (details as any).discountedPrice ?? (details as any).price;
      total += price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        productName: (product as any).name,
        price,
        quantity: item.quantity,
      });
    }

    if (!orderItemsData.length) {
      return res
        .status(400)
        .json({ success: false, message: 'No valid items to order' });
    }

    const order = await OrderDetails.create({
      userId,
      addressId,
      paymentMethod,
      total,
      status: 'pending',
      paymentStatus: 'pending',
    });
    const items = await OrderItems.insertMany(
      orderItemsData.map((item) => ({ ...item, orderId: order._id }))
    );

    // Decrement stock and clear cart
    for (const item of orderItemsData) {
      await ProductDetails.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }
    await CartItems.deleteMany({ cartId: cart._id });
    await Cart.findByIdAndUpdate(cart._id, { total: 0 });

    return res
      .status(201)
      .json({
        success: true,
        message: 'Order placed successfully',
        data: { ...order.toObject(), items },
      });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const order = await OrderDetails.findOne({ _id: id, userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    const currentStatus = (order as any).status as string;
    if (['shipped', 'delivered'].includes(currentStatus)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Order cannot be cancelled at this stage',
        });
    }
    if (currentStatus === 'cancelled') {
      return res
        .status(400)
        .json({ success: false, message: 'Order is already cancelled' });
    }

    order.set({ status: 'cancelled' });
    await order.save();

    // Restore stock
    const items = await OrderItems.find({ orderId: id }).lean();
    for (const item of items) {
      await ProductDetails.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { stock: item.quantity } }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// ── Admin ──────────────────────────────────────────────────────────────────────

export const adminGetOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const orders = await OrderDetails.find(filter)
      .populate('userId', 'email username')
      .populate('addressId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await OrderDetails.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const adminUpdateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const order = await OrderDetails.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
