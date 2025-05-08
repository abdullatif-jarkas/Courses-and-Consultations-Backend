import { Document, Types } from "mongoose";

//* COURSE GENERAL TYPE

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: "recorded" | "in-person";
  duration: number;
  recordedCourse?: Types.ObjectId;
  inPersonCourse?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

//? For In Person Courses
export interface IInPersonCourse extends Document {
  courseId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  location: string;
}

//? For Recorded Courses
interface FileItem {
  fileName: string;
  fileUrl: string;
  fileType: "video" | "pdf" | "other";
}

export interface IRecordedCourse extends Document {
  courseId: Types.ObjectId;
  files: FileItem[];
}
