import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RecordedCourse } from "../models/recordedCourse.model";
import { Course } from "@/models/course.model";
import { Types } from "mongoose";

function detectFileType(mimetype: string): "video" | "pdf" | "image" | "other" {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  return "other";
}

/**
 * @desc Create a new recorded course with uploaded files
 * @route POST /api/recorded-courses
 * @access Private/Admin
 */
export const createRecordedCourseWithFiles = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, price, image, duration } = req.body;

    if (!title || !description || !price || !image || !duration) {
      res.status(400);
      throw new Error(
        "Missing required fields: title, description, price, image, duration"
      );
    }

    const course = new Course({
      title,
      description,
      price,
      image,
      duration,
      type: "recorded",
      inPersonCourse: undefined,
    });
    await course.save();

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      res.status(400);
      throw new Error("No files uploaded");
    }

    const formattedFiles = files.map((file) => ({
      fileName: file.originalname,
      fileUrl: file.path,
      fileType: detectFileType(file.mimetype),
    }));

    const recordedCourse = new RecordedCourse({
      courseId: course._id,
      files: formattedFiles,
    });
    await recordedCourse.save();

    course.recordedCourse = recordedCourse._id as Types.ObjectId;
    await course.save();

    res.status(201).json({
      message: "Recorded course created successfully",
      data: { course, recordedCourse },
    });
  }
);

/**
 * @desc Get all recorded courses with their base course data
 * @route GET /api/recorded-courses
 * @access Public
 */
export const getAllRecordedCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const recordedCourses = await RecordedCourse.find().populate("courseId");
    res.status(200).json({
      status: "success",
      data: recordedCourses,
    });
  }
);

/**
 * @desc Get a single recorded course by ID
 * @route GET /api/recorded-courses/:id
 * @access Public
 */
export const getSingleRecordedCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const recordedCourse = await RecordedCourse.findById(id).populate(
      "courseId"
    );

    if (!recordedCourse) {
      res.status(404);
      throw new Error("Recorded course not found");
    }

    res.status(200).json(recordedCourse);
  }
);

/**
 * @desc Update a recorded course (files and base course info)
 * @route PUT /api/recorded-courses/:id
 * @access Private/Admin
 */
export const updateRecordedCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { files, title, description, price, image, duration } = req.body;

    const recordedCourse = await RecordedCourse.findById(id);
    if (!recordedCourse) {
      res.status(404);
      throw new Error("Recorded course not found");
    }

    if (files) {
      recordedCourse.files = files;
      await recordedCourse.save();
    }

    const courseUpdates: Partial<typeof Course.prototype> = {};
    if (title !== undefined) courseUpdates.title = title;
    if (description !== undefined) courseUpdates.description = description;
    if (price !== undefined) courseUpdates.price = price;
    if (image !== undefined) courseUpdates.image = image;
    if (duration !== undefined) courseUpdates.duration = duration;

    if (Object.keys(courseUpdates).length > 0) {
      await Course.findByIdAndUpdate(recordedCourse.courseId, courseUpdates, {
        new: true,
      });
    }

    const updated = await RecordedCourse.findById(id).populate("courseId");

    res.status(200).json({
      message: "Recorded course and course data updated successfully",
      data: updated,
    });
  }
);

/**
 * @desc Delete a recorded course and its base course
 * @route DELETE /api/recorded-courses/:id
 * @access Private/Admin
 */
export const deleteRecordedCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const recordedCourse = await RecordedCourse.findById(id);
    if (!recordedCourse) {
      res.status(404);
      throw new Error("Recorded course not found");
    }

    await Course.findByIdAndDelete(recordedCourse.courseId);
    await RecordedCourse.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        message: "Recorded course and related course deleted successfully",
      });
  }
);
