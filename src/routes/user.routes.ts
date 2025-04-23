import { verifyToken } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/role.middleware";
import { Router } from "express";
const userRouter = Router();

// Only for admin
userRouter.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.send("Admin page");
});

// for admin and employee
userRouter.get("/employee", verifyToken, authorizeRoles("admin", "employee"), (req, res) => {
  res.send("Employee page");
});

// for all users
userRouter.get("/", (req, res) => {
  res.send("User page");
});

export default userRouter;
