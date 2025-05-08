import Event from "@/models/event.model";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 * @param {string} name
 * @param {string} description
 * @param {Date} date
 * @param {string} location
 * @returns {Promise<void>}
 * @route POST /api/events
 * @access Private (admin only)
 */
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, date, location } = req.body;

  const event = await Event.create({
    name,
    description,
    date,
    location,
  });

  res.status(201).json({
    status: "success",
    data: event,
  });
});

/**
 * @returns {Promise<void>}
 * @route GET /api/events
 * @access Public (everyone)
 */

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await Event.find();

  res.status(200).json({
    status: "success",
    data: events,
  });
});

/**
 * @param {string} id
 * @returns {Promise<void>}
 * @route GET /api/events/:id
 * @access Public (everyone)
 */

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404).json({
      status: "error",
      message: "Event not found",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

/**
 * @param {string} id
 * @param {string} name
 * @param {string} description
 * @param {string} date
 * @param {string} location
 * @returns {Promise<void>}
 * @route PUT /api/events/:id
 * @access Private (admin only)
 */

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    res.status(404).json({
      status: "error",
      message: "Event not found",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

/**
 * @param {string} id
 * @returns {Promise<void>}
 * @route DELETE /api/events/:id
 * @access Private (admin only)
 */

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    res.status(404).json({
      status: "error",
      message: "Event not found",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Event deleted successfully",
  });
});
