import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
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

// Trust proxy — required behind Cloudflare / Vercel / Railway / Heroku
app.set("trust proxy", 1);

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                    // Strict limit for auth endpoints
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", globalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: { status: "OK", timestamp: new Date() }
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/interviews", interviewRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
export { app };
