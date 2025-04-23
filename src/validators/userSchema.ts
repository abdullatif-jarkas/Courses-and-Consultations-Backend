// validators/userSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["user", "admin", "employee"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});