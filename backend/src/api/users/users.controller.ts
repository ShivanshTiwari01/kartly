import { Request, Response } from 'express';
import User from '../../models/user.model';
import UserProfile from '../../models/userProfile.model';
import UserAddress from '../../models/userAddress.model';
import { logger } from '../../app';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
} from './users.validation';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    const profile = await UserProfile.findOne({ userId }).lean();
    return res
      .status(200)
      .json({ success: true, data: { ...user, profile: profile ?? null } });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { firstName, lastName } = parsed.data;
    const existing = await UserProfile.findOne({ userId });

    let profile;
    if (existing) {
      const update: Record<string, any> = {};
      if (firstName !== undefined) update.firstName = firstName;
      if (lastName !== undefined) update.lastName = lastName;
      const newFirst = firstName ?? existing.firstName;
      const newLast = lastName ?? existing.lastName;
      update.fullName = `${newFirst} ${newLast}`;
      profile = await UserProfile.findOneAndUpdate({ userId }, update, {
        new: true,
      });
    } else {
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'firstName and lastName are required to create a profile',
        });
      }
      profile = await UserProfile.create({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        userId,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Profile updated', data: profile });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(200).json({ success: true, data: [] });
    }
    const addresses = await UserAddress.find({
      userProfileId: profile._id,
    }).lean();
    return res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const parsed = createAddressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message:
          'Profile not found. Please update your profile before adding addresses.',
      });
    }

    const address = await UserAddress.create({
      ...parsed.data,
      userProfileId: profile._id,
    });
    return res
      .status(201)
      .json({ success: true, message: 'Address created', data: address });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;
    const parsed = updateAddressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Profile not found' });
    }

    const address = await UserAddress.findOneAndUpdate(
      { _id: id, userProfileId: profile._id },
      parsed.data,
      { new: true }
    );
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Address updated', data: address });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Profile not found' });
    }

    const address = await UserAddress.findOneAndDelete({
      _id: id,
      userProfileId: profile._id,
    });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: 'Address not found' });
    }

    return res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
