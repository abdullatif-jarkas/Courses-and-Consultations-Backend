import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { InPersonCourse } from "../models/inPersonCourse.model";
import { Course } from "../models/course.model";
import { Types } from "mongoose";

export const createInPersonCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, price, image, duration, startDate, endDate, location } = req.body;

  const course = new Course({
    title,
    description,
    price,
    image,
    duration,
    type: "in-person",
  });
  await course.save();

  const inPersonCourse = new InPersonCourse({
    courseId: course._id,
    startDate,
    endDate,
    location,
  });
  await inPersonCourse.save();

  course.inPersonCourse = inPersonCourse._id as Types.ObjectId;
  await course.save();

  res.status(201).json({
    status: "success",
    data: inPersonCourse,
  });
});

export const getAllInPersonCourses = asyncHandler(async (req: Request, res: Response) => {
  const inPersonCourses = await InPersonCourse.find().populate("courseId");
  res.status(200).json({
    status: "success",
    data: inPersonCourses,
  });
});

export const getInPersonCourseById = asyncHandler(async (req: Request, res: Response) => {
  const inPersonCourse = await InPersonCourse.findById(req.params.id).populate("courseId");
  if (!inPersonCourse) {
    res.status(404);
    throw new Error("In-person course not found");
  }
  res.status(200).json({
    status: "success",
    data: inPersonCourse,
  });
});

export const deleteInPersonCourse = asyncHandler(async (req: Request, res: Response) => {
  const inPersonCourse = await InPersonCourse.findByIdAndDelete(req.params.id);
  if (!inPersonCourse) {
    res.status(404);
    throw new Error("In-person course not found");
  }

  await Course.findByIdAndDelete(inPersonCourse.courseId);

  res.status(200).json({
    message: "In-person course and related course deleted successfully",
  });
});

export const updateInPersonCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, price, image, duration, startDate, endDate, location } = req.body;

  const inPersonCourse = await InPersonCourse.findById(id);
  if (!inPersonCourse) {
    res.status(404);
    throw new Error("In-person course not found");
  }

  // تحديث البيانات الخاصة بـ InPersonCourse
  if (startDate !== undefined) inPersonCourse.startDate = startDate;
  if (endDate !== undefined) inPersonCourse.endDate = endDate;
  if (location !== undefined) inPersonCourse.location = location;
  await inPersonCourse.save();

  // تحديث البيانات الخاصة بـ Course المرتبط
  const courseUpdates: Partial<typeof Course.prototype> = {};
  if (title !== undefined) courseUpdates.title = title;
  if (description !== undefined) courseUpdates.description = description;
  if (price !== undefined) courseUpdates.price = price;
  if (image !== undefined) courseUpdates.image = image;
  if (duration !== undefined) courseUpdates.duration = duration;

  if (Object.keys(courseUpdates).length > 0) {
    await Course.findByIdAndUpdate(inPersonCourse.courseId, courseUpdates, { new: true });
  }

  const updated = await InPersonCourse.findById(id).populate("courseId");

  res.status(200).json({
    message: "In-person course and course data updated successfully",
    data: updated,
  });
});
