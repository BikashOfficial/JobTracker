import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import {
  notFound,
  errorHandler,
} from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();


app.use(helmet());



app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());


// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ApplyTrack API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`ApplyTrack API running on port ${PORT}`);
});

