import mongoose from 'mongoose';
import User from './user.model';
import UserAddress from './userAddress.model';

const orderDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    total: {
      type: Number,
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserAddress,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

export default OrderDetails;
