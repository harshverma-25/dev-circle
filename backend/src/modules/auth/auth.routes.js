import express from "express";
import { register, login, refreshToken } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken);

export default router;