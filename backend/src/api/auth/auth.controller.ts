import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  userRegisterSchema,
  userSignInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';
import { logger } from '../../app';
import { getRedis } from '../../services/redis';
import {
  signAccessToken,
  signRefreshToken,
  accessTokenExpiry,
  refreshTokenExpiry,
} from '../../helpers/authentication';

import User from '../../models/user.model';
import UserProfile from '../../models/userProfile.model';
import UserSession from '../../models/userSession.model';

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData: any = userRegisterSchema.safeParse(req.body);

    if (!parsedData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
      });
    }

    const { email, password } = parsedData.data;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists. Please login to continue',
      });
    }

    const username = email.split('@')[0];

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await UserSession.create({
      accessToken,
      refreshToken,
      accessTokenExpiry: accessTokenExpiry,
      refreshTokenExpiry: refreshTokenExpiry,
      userId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error({ Error: error });
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const parsedData: any = userSignInSchema.safeParse(req.body);

    if (!parsedData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
      });
    }

    const { email, password } = parsedData.data;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await UserSession.create({
      accessToken,
      refreshToken,
      accessTokenExpiry: accessTokenExpiry,
      refreshTokenExpiry: refreshTokenExpiry,
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'User Logged In Successfully',
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });

    // Don't leak whether the account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If an account with that email exists, a reset token has been issued.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const redis = getRedis();
    await redis.setex(`reset_password:${token}`, 3600, email);

    return res.status(200).json({
      success: true,
      message: 'Password reset token generated.',
      resetToken: token,
    });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { token, newPassword } = parsed.data;
    const redis = getRedis();
    const email = await redis.get(`reset_password:${token}`);

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    await redis.del(`reset_password:${token}`);

    return res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    logger.error({ Error: error });
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const updateToken = async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.user!;

    const userSessionExists = await UserSession.findOne({
      userId,
    });

    if (!userSessionExists) {
      return res.status(400).json({
        success: false,
        message: 'User session not found',
      });
    }

    const payload = {
      userId,
      email,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    const userSession = await UserSession.create({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiry: accessTokenExpiry,
      refreshTokenExpiry: refreshTokenExpiry,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'User session refreshed successfully',
      token: {
        newAccessToken,
        newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error,',
    });
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const userSessionExists = await UserSession.findOne({
      userId,
    });

    if (!userSessionExists) {
      return res.status(400).json({
        success: false,
        message: 'User session not found',
      });
    }

    await UserSession.deleteMany({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'User signed out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error,',
    });
  }
};
