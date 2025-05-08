import {
  createInPersonCourse,
  deleteInPersonCourse,
  getAllInPersonCourses,
  getInPersonCourseById,
  updateInPersonCourse,
} from "@/controllers/inPersonCourse.controller";
import verifyToken from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/role.middleware";

import { Router } from "express";

const inPersonCourseRoutes = Router();

inPersonCourseRoutes
  .route("/")
  .get(getAllInPersonCourses)
  .post(verifyToken, authorizeRoles("admin"), createInPersonCourse);

inPersonCourseRoutes
  .route("/:id")
  .get(getInPersonCourseById)
  .delete(verifyToken, authorizeRoles("admin"), deleteInPersonCourse)
  .put(verifyToken, authorizeRoles("admin"), updateInPersonCourse);

export default inPersonCourseRoutes;
