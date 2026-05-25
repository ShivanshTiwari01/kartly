import mongoose from 'mongoose';
import Product from './product.model';

const productDetailsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

export default ProductDetails;
