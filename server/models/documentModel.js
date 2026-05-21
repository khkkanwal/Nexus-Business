import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    version: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,

      enum: ["uploaded", "pending", "approved", "rejected"],

      default: "uploaded",
    },

    signatureUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
