import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
});

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [participantSchema],

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  },
);

meetingSchema.pre("save", function () {
  if (this.endTime <= this.startTime) {
    throw new Error("End time must be after start time");
  }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
