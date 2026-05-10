import express from "express";
import authController from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/me", auth, authController.getCurrentUser);
router.put("/profile", auth, authController.updateProfile);
router.put("/change-password", auth, authController.changePassword);

export default router;
