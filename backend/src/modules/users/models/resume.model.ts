import mongoose, { Schema } from "mongoose";
import { IResumeDocument } from "../types/resume.types.js";

const resumeSchema = new Schema<IResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // Ensure 1:1 user to resume constraint
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
resumeSchema.index({ userId: 1 });

const Resume = mongoose.model<IResumeDocument>("Resume", resumeSchema);

export default Resume;
export { Resume };
