import mongoose from 'mongoose';
import Categories from './categories.model';

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Categories,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
