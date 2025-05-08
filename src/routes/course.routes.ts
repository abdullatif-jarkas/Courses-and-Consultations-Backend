import {
  getAllCourses,
  getCourseById,
} from "@/controllers/courses.controller";
import { Router } from "express";

const courseRoutes = Router();

courseRoutes.get("/", getAllCourses);
courseRoutes.get("/:id", getCourseById);

export default courseRoutes;
