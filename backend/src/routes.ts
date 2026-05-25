import express from 'express';
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/users/users.routes';
import productRoutes from './api/products/products.routes';
import categoryRoutes from './api/categories/categories.routes';
import cartRoutes from './api/cart/cart.routes';
import wishlistRoutes from './api/wishlist/wishlist.routes';
import orderRoutes from './api/orders/orders.routes';
import adminOrderRoutes from './api/orders/admin.orders.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/admin/orders', adminOrderRoutes);

export default router;
