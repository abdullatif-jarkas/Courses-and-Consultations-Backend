import express from "express";
import verifyToken from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/role.middleware";
import { bookConsultation, createConsultation, getAvailableConsultations } from "@/controllers/consultation.controller";

const consultationRoutes = express.Router();

consultationRoutes.post("/", verifyToken, authorizeRoles("admin"), createConsultation);

consultationRoutes.get("/available", verifyToken, getAvailableConsultations);

consultationRoutes.put("/book/:id", verifyToken, bookConsultation);

export default consultationRoutes;
