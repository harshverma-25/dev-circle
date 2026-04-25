import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// prevent duplicate joins
participantSchema.index(
  { interviewId: 1, userId: 1 },
  { unique: true }
);

const Participant = mongoose.model("Participant", participantSchema);

export default Participant;