import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import { protect } from "./middleware/auth.middleware.js";

const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:3000",
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

app.use("/api/auth", authRoutes);


export default app;