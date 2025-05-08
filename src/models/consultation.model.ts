import { Schema, model } from "mongoose";
import { IConsultation } from "@/types/consultation";

const ConsultationSchema = new Schema<IConsultation>(
  {
    consultationType: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "booked", "confirmed", "completed", "cancelled"],
      default: "available",
    },
    paymentMethod: {
      type: String,
      enum: ["external", "internal", "cash"],
      required: false, // أو يمكنك إزالتها من الاستشارة وإنشاءها عند الحجز فقط
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "unpaid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Consultation = model<IConsultation>(
  "Consultation",
  ConsultationSchema
);
