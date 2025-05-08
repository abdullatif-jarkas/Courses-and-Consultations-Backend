// validators/userSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(6),
  phoneNumber: z.string().min(10),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  resetCode: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
