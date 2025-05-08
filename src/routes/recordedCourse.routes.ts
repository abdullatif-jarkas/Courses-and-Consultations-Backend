import { createRecordedCourseWithFiles, deleteRecordedCourse, getAllRecordedCourses, getSingleRecordedCourse, updateRecordedCourse } from "@/controllers/recordedCourse.controller";
import verifyToken from "@/middlewares/auth.middleware";
import { authorizeRoles } from "@/middlewares/role.middleware";
import { Router } from "express";
import multer from "multer";

//? Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const recordedCourseRoutes = Router();

recordedCourseRoutes
  .route("/")
  .post(verifyToken, authorizeRoles("admin"), upload.array("files"), createRecordedCourseWithFiles)
  .get(getAllRecordedCourses);


recordedCourseRoutes
  .route("/:id")
  .get(getSingleRecordedCourse)
  .put(verifyToken, authorizeRoles("admin"), upload.array("files"), updateRecordedCourse)
  .delete(verifyToken, authorizeRoles("admin"), deleteRecordedCourse)

export default recordedCourseRoutes;
