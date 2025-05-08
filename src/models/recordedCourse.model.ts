import { IRecordedCourse } from "@/types/courses";
import { Schema, model } from "mongoose";

const FileItemSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["video", "pdf", "image", "other"],
    required: true,
  },
});

const RecordedCourseSchema = new Schema<IRecordedCourse>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    files: [FileItemSchema],
  },
  { timestamps: true }
);

export const RecordedCourse = model<IRecordedCourse>(
  "RecordedCourse",
  RecordedCourseSchema
);
