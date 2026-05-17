import express from "express";
import meetingController from "../controllers/meetingController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", auth, meetingController.createMeeting);

router.get("/", auth, meetingController.getMeetings);

router.get("/:id", auth, meetingController.getMeetingById);

router.put("/:id", auth, meetingController.updateMeeting);

router.delete("/:id", auth, meetingController.deleteMeeting);

router.put("/:id/accept", auth, meetingController.acceptMeeting);

router.put("/:id/reject", auth, meetingController.rejectMeeting);

export default router;
