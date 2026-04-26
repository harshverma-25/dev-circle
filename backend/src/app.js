import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes.js";
import { protect } from "./middleware/auth.middleware.js";
import interviewRoutes from "./modules/interview/interview.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many authentication attempts, please try again later"
});

// middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/interview", interviewRoutes);


app.use(errorHandler);

export default app;