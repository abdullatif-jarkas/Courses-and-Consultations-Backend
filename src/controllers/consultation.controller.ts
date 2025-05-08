import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Consultation } from "@/models/consultation.model";

/**
 * @route   POST /api/consultations
 * @access  Private (Admin)
 */
export const createConsultation = asyncHandler(
  async (req: Request, res: Response) => {
    const { consultationType, scheduledAt, paymentMethod } = req.body;

    const exists = await Consultation.findOne({ scheduledAt });
    if (exists) {
      res.status(400).json({
        status: "error",
        message: "Consultation already exists at this time.",
      });
      return;
    }

    const consultation = await Consultation.create({
      consultationType,
      scheduledAt,
      paymentMethod,
      status: "available",
    });

    res.status(201).json({ status: "success", data: consultation });
  }
);

/**
 * @route   GET /api/consultations/available
 * @access  Private (User)
 */
export const getAvailableConsultations = asyncHandler(
  async (_req: Request, res: Response) => {
    const consultations = await Consultation.find({ status: "available" }).sort(
      { scheduledAt: 1 }
    );
    res.status(200).json({ status: "success", data: consultations });
  }
);

/**
 * @route   PUT /api/consultations/book/:id
 * @access  Private (User)
 */
export const bookConsultation = asyncHandler(async (req: Request, res: Response) => {
  const consultation = await Consultation.findById(req.params.id).populate("userId");

  if (!consultation || consultation.status !== "available") {
    res.status(400).json({ status: "error", message: "Consultation not available" });
    return;
  }

  const { paymentMethod } = req.body;

  if (!["external", "internal", "cash"].includes(paymentMethod)) {
    res.status(400).json({ status: "error", message: "Invalid payment method" });
    return;
  }

  consultation.userId = req.user!.userId;
  consultation.status = "booked";
  consultation.paymentStatus = "pending";
  consultation.paymentMethod = paymentMethod;

  await consultation.save(); 

  console.log("Updated Consultation: ", consultation);

  res.status(200).json({
    status: "success",
    data: consultation,
  });
});
