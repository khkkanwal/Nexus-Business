import Meeting from "../models/meetingModel.js";

const meetingController = {};

meetingController.createMeeting = async (req, res) => {
  try {
    const { title, description, participants, startTime, endTime } = req.body;

    const organizer = req.user.id;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        message: "Title, start time and end time are required",
      });
    }

    const existingMeeting = await Meeting.findOne({
      organizer,

      startTime: { $lt: endTime },

      endTime: { $gt: startTime },

      status: "scheduled",
    });

    if (existingMeeting) {
      return res.status(400).json({
        message: "Meeting time conflicts with another meeting",
      });
    }

    const formattedParticipants =
      participants?.map((participantId) => ({
        user: participantId,
        status: "pending",
      })) || [];

    const meeting = await Meeting.create({
      title,
      description,
      organizer,
      participants: formattedParticipants,
      startTime,
      endTime,
    });

    res.status(201).json({
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ organizer: req.user.id }, { "participants.user": req.user.id }],
    })
      .populate("organizer", "name email")
      .populate("participants.user", "name email")
      .sort({ startTime: 1 });

    res.status(200).json({
      message: "Meetings retrieved successfully",
      meetings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("participants.user", "name email");

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const isParticipant = meeting.participants.some(
      (participant) => participant.user._id.toString() === req.user.id,
    );

    if (meeting.organizer._id.toString() !== req.user.id && !isParticipant) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      message: "Meeting retrieved successfully",
      meeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.updateMeeting = async (req, res) => {
  try {
    const { title, description, participants, startTime, endTime } = req.body;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    if (meeting.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (startTime && endTime) {
      const existingMeeting = await Meeting.findOne({
        organizer: req.user.id,

        _id: { $ne: meeting._id },

        startTime: { $lt: endTime },

        endTime: { $gt: startTime },

        status: "scheduled",
      });

      if (existingMeeting) {
        return res.status(400).json({
          message: "Meeting time conflicts with another meeting",
        });
      }
    }

    if (title) meeting.title = title;

    if (description) meeting.description = description;

    if (startTime) meeting.startTime = startTime;

    if (endTime) meeting.endTime = endTime;

    if (participants) {
      meeting.participants = participants.map((participantId) => ({
        user: participantId,
        status: "pending",
      }));
    }

    await meeting.save();

    res.status(200).json({
      message: "Meeting updated successfully",
      meeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    if (meeting.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // FIND PARTICIPANT
    const participant = meeting.participants.find(
      (p) => p.user.toString() === req.user.id,
    );

    if (!participant) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    participant.status = "accepted";

    await meeting.save();

    res.status(200).json({
      message: "Meeting accepted successfully",
      meeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

meetingController.rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    const participant = meeting.participants.find(
      (p) => p.user.toString() === req.user.id,
    );

    if (!participant) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    participant.status = "declined";

    await meeting.save();

    res.status(200).json({
      message: "Meeting rejected successfully",
      meeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export default meetingController;
