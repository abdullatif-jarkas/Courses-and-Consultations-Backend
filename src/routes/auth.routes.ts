import { Router } from "express";
const authRouter = Router();
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from "@/controllers/auth.controller";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/refresh-token", refreshToken);
export default authRouter;
