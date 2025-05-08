import { IInPersonCourse } from "@/types/courses";
import mongoose, { Schema, model } from "mongoose";

const InPersonCourseSchema: Schema = new Schema<IInPersonCourse>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const InPersonCourse = model<IInPersonCourse>("InPersonCourse",InPersonCourseSchema);
