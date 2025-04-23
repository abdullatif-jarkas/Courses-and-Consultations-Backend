import { NextFunction, Request, Response } from "express";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        role: string;
      };
    }
  }
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};
