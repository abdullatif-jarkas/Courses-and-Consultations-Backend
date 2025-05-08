import { IUser } from "@/types/user";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },
    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
