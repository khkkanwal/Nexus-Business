import express from "express";

import documentController from "../controllers/documentController.js";

import { auth } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  auth,
  upload.single("document"),
  documentController.uploadDocument,
);

router.get("/", auth, documentController.getDocuments);

router.put(
  "/:id/sign",
  auth,
  upload.single("signature"),
  documentController.uploadSignature,
);
router.delete("/:id", auth, documentController.deleteDocument);

export default router;
