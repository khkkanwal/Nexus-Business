import express from "express";
import otpController from "../controllers/otpController.js";

const router = express.Router();

router.post("/send", otpController.sendOtp);

export default router;
