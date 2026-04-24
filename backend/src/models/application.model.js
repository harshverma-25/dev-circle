import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

// prevent duplicate application
applicationSchema.index({ interviewId: 1, userId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;