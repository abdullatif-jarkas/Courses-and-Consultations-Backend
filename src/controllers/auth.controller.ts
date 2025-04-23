import User from "@/models/User";
import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "@/types/user";
import { loginSchema, registerSchema } from "@/validators/userSchema";
import { JWT_SECRET } from "@/config/config";
import asyncHandler from "express-async-handler";

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
    role,
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
