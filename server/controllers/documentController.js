import Document from "../models/documentModel.js";
import fs from "fs";
import sanitizeHtml from "sanitize-html";

const documentController = {};

documentController.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Document file is required",
      });
    }

    const title = sanitizeHtml(req.body.title || req.file.originalname).trim();

    const document = await Document.create({
      title,
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

documentController.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

documentController.uploadSignature = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Signature image required",
      });
    }

    document.signatureUrl = req.file.path;

    document.status = "completed";

    await document.save();

    res.status(200).json({
      message: "Signature uploaded successfully",
      document,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

documentController.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const filePath = `./${document.fileUrl}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export default documentController;
