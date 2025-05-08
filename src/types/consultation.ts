import { Types } from "mongoose";

export interface IConsultation {
  userId?: Types.ObjectId;
  consultationType: string;
  scheduledAt: Date;
  status?: "available" | "booked" | "confirmed" | "completed" | "cancelled";
  paymentMethod?: "external" | "internal" | "cash";
  paymentStatus?: "pending" | "paid" | "unpaid";
}