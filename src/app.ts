import express from "express";
const app = express();
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//? Middleware
app.use(cors({
  origin: 'http://localhost:5173', //? allow only this origin to send cookies
  credentials: true, //? to allow cookies to be sent with the request
}));
app.use(express.json());
app.use(helmet());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(morgan("dev"));

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
