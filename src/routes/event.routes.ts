import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "@/controllers/event.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/role.middleware";

const eventRouter = Router();

// Public routes
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEvent);

// Protected routes (admin only)
eventRouter.post("/", verifyToken, authorizeRoles("admin"), createEvent);
eventRouter.put("/:id", verifyToken, authorizeRoles("admin"), updateEvent);
eventRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteEvent);

export default eventRouter;
