import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import http from "http";
import { Server } from "socket.io";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/otp", otpRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    console.log(`User joined room: ${roomId}`);
  });
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
  socket.on("end-call", (roomId) => {
    socket.to(roomId).emit("call-ended");
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
