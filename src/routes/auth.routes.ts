import express from "express";
import { Router } from "express";
const authRouter = Router();
import { register, login } from "@/controllers/auth.controller";

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;