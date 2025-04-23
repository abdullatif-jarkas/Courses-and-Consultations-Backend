import express from "express";
import { Router } from "express";
const authRouter = Router();
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "@/controllers/auth.controller";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
