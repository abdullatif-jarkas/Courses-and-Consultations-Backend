import express from "express";
const app = express();
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

//? Middleware
app.use(cors());
app.use(express.json());


//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);




export default app;