import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

export const verifyToken = ( req: Request, res: Response, next: NextFunction ) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    res.status(500).json({ message: "JWT secret is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default verifyToken;
