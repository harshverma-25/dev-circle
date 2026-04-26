import express from "express";
import { body } from "express-validator";
import { register, login, refreshToken, logout } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;