import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    scheduledAt: {
      type: Date,
      required: true
    },

    duration: {
      type: Number, // in minutes
      required: true
    },

    maxParticipants: {
      type: Number,
      default: 5
    },

    isStarted: {
      type: Boolean,
      default: false
    },

    startedAt: {
      type: Date,
      default: null
    },

    roomName: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;