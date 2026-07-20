import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authRoutes } from "./modules/auth/routes/auth.routes.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { companyRoutes } from "./modules/companies/routes/company.routes.js";
import { jobRoutes } from "./modules/jobs/routes/job.routes.js";
import { applicationRoutes } from "./modules/applications/routes/application.routes.js";
import { interviewRoutes } from "./modules/interviews/routes/interview.routes.js";
import { aiRoutes } from "./modules/ai/routes/ai.routes.js";
import { searchRoutes } from "./modules/search/routes/search.routes.js";
import { adminRoutes } from "./modules/admin/routes/admin.routes.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";

const app: Express = express();

// Trust proxy for rate limiting (especially behind Cloudflare/Vercel/Heroku)
app.set("trust proxy", 1);

// Global Middlewares
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL || ""
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: {
      status: "OK",
      timestamp: new Date()
    }
  });
});

// ─── Auth Routes ─────────────────────────────────────────────────────────────
// Supports both V1 API base path and legacy base path for backward compatibility
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/auth", authLimiter, authRoutes);

// ─── Users Routes ────────────────────────────────────────────────────────────
app.use("/api/v1/users", userRoutes);
app.use("/api/users", userRoutes);

// ─── Companies Routes ────────────────────────────────────────────────────────
app.use("/api/v1/companies", companyRoutes);
app.use("/api/companies", companyRoutes);

// ─── Jobs Routes ─────────────────────────────────────────────────────────────
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/jobs", jobRoutes);

// ─── Applications Routes ──────────────────────────────────────────────────────
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/applications", applicationRoutes);

// ─── Interviews Routes ────────────────────────────────────────────────────────
app.use("/api/v1/interviews", interviewRoutes);
app.use("/api/interviews", interviewRoutes);

// ─── AI Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/ai", aiRoutes);
app.use("/api/ai", aiRoutes);

// ─── Search Routes ───────────────────────────────────────────────────────────
app.use("/api/v1/search", searchRoutes);
app.use("/api/search", searchRoutes);

// ─── Admin Routes ────────────────────────────────────────────────────────────
app.use("/api/v1/admin", adminRoutes);
app.use("/api/admin", adminRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
export { app };
