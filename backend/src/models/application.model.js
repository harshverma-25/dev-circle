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
    },

    // Resume submitted when applying
    resumeUrl: {
      type: String,
      default: null   // null means file was deleted by cron
    },

    resumeType: {
      type: String,
      enum: ["link", "file"],
      default: "link"
    },

    // Cloudinary public_id — stored so cron can delete after 2 days
    cloudinaryPublicId: {
      type: String,
      default: null
    },

    // Host decision on this application
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ interviewId: 1, userId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;