import mongoose from 'mongoose';
import User from './user.model';

const userSession = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    deviceDetails: {
      type: JSON,
    },
    userLocation: {
      type: JSON,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
