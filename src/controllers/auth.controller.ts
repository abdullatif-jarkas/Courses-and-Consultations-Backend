import User from "@/models/user.model";
import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "@/types/user";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from "@/validators/userSchema";
import { JWT_SECRET } from "@/config/config";
import asyncHandler from "express-async-handler";
import { sendEmail } from "@/utils/sendEmail";
import {
  generateAccessToken,
  generateExpiryMinutes,
  generateOTP,
  generateRefreshToken,
} from "@/utils/authHelpers";

/** @description Register
 * @param {string} fullName
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<void>}
 * @route POST /api/auth/register
 */

export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      status: "error",
      message: "Invalid input data",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { fullName, email, password, phoneNumber } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({
      status: "error",
      message: "Email is already registered",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: IUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phoneNumber,
    role: "user",
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, //? 15 Minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //? 7 Days
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    },
  });
});

/** @description Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 * @route POST /api/auth/login
 */

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid input data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordValid) {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
      return;
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //? 15 Minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //? 7 Days
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      },
    });
  }
);

/** @description Logout
 * @returns {Promise<void>}
 * @route POST /api/auth/logout
 */

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

/** @description Forgot password
 * @param {string} email
 * @returns {Promise<void>}
 * @route POST /api/auth/forgot-password
 */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid input data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const otpCode = generateOTP(6);
    const expiryDate = generateExpiryMinutes(10);

    user.resetCode = otpCode;
    user.resetCodeExpires = expiryDate;
    await user.save();

    await sendEmail(
      email,
      "Your Password Reset Code",
      `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              padding: 10px;
              background-color: #f4f4f9;
              border-radius: 4px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We received a request to reset your password. Please use the following code to reset your password:</p>
              <p class="otp-code">${otpCode}</p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p>Best regards,<br>Your Team</p>
            </div>
            <div class="footer">
              <p>For any issues, please contact support.</p>
            </div>
          </div>
        </body>
      </html>
      `
    );

    res.status(200).json({
      status: "success",
      message: "OTP sent to email",
    });
  }
);

/** @description Reset password
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<void>}
 * @route POST /api/auth/reset-password
 */

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid input data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, resetCode, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpires) {
      res.status(400).json({
        status: "error",
        message: "Invalid or expired code.",
      });
      return;
    }

    const isCodeValid =
      user.resetCode === resetCode && user.resetCodeExpires > new Date();
    if (!isCodeValid) {
      res.status(400).json({
        status: "error",
        message: "Invalid or expired code.",
      });
      return;
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password successfully updated.",
    });
  }
);

/** @description Refresh token
 * @returns {Promise<void>}
 * @route POST /api/auth/refresh-token
 */

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ status: "error", message: "No refresh token" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401).json({ status: "error", message: "User not found" });
        return;
      }

      const newAccessToken = generateAccessToken(user._id, user.role);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        status: "success",
        message: "Access token refreshed",
      });
    } catch (err) {
      res
        .status(403)
        .json({ status: "error", message: "Invalid refresh token" });
    }
  }
);
