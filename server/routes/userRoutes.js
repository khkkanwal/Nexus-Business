import express from "express";
import User from "../models/userModel.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
