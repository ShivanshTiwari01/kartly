import mongoose from 'mongoose';
import OrderDetails from './orderDetails.model';
import Product from './product.model';

const orderItemsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: OrderDetails,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderItems = mongoose.model('OrderItems', orderItemsSchema);

export default OrderItems;
