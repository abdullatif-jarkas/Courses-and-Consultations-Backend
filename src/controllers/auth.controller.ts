import User from "@/models/User";
import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "@/types/user";
import { loginSchema, registerSchema } from "@/validators/userSchema";
import { JWT_SECRET } from "@/config/config";
import asyncHandler from "express-async-handler";
import { sendEmail } from "@/utils/sendEmail";
import { generateExpiryMinutes, generateOTP } from "@/utils/authHelpers";

/** @description Register
 * @param {string} fullName
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<void>}
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

  const { fullName, email, password, role } = parsed.data;

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
    role: "user",
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/** @description Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
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

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

/** @description Forgot password
 * @param {string} email
 * @returns {Promise<void>}
 */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

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
      "Your Reset Code",
      `Your password reset code is: ${otpCode}`
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
 */

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpires) {
      res.status(400).json({
        status: "error",
        message: "Invalid or expired code.",
      });
      return;
    }

    const isCodeValid =
      user.resetCode === code && user.resetCodeExpires > new Date();
    if (!isCodeValid) {
      res.status(400).json({
        status: "error",
        message: "Invalid or expired code.",
      });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password successfully updated.",
    });
  }
);
