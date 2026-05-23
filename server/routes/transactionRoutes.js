import express from "express";

import { auth } from "../middlewares/authMiddleware.js";

import transactionController from "../controllers/transactionController.js";

const router = express.Router();

router.post("/deposit", auth, transactionController.deposit);

router.post("/withdraw", auth, transactionController.withdraw);

router.post("/transfer", auth, transactionController.transfer);

router.get("/", auth, transactionController.getTransactions);

export default router;
