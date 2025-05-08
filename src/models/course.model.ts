import { ICourse } from "@/types/courses";
import { Schema, model } from "mongoose";

const CourseSchema: Schema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["recorded", "in-person"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    recordedCourse: {
      type: Schema.Types.ObjectId,
      ref: "RecordedCourse",
      unique: true,
      sparse: true,
    },
    inPersonCourse: {
      type: Schema.Types.ObjectId,
      ref: "InPersonCourse",
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Course = model<ICourse>("Course", CourseSchema);
