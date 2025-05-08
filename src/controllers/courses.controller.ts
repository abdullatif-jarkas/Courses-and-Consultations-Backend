import { Request, Response } from "express";
import { Course } from "../models/course.model";

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
};

// export const updateCourse = async (req: Request, res: Response) => {
//   try {
//     const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!course) {
//       res.status(404).json({ message: "Course not found" });
//       return;
//     }
//     res.status(200).json(course);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating course", error });
//   }
// };

