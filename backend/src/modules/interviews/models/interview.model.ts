import mongoose, { Schema } from "mongoose";
import { IInterviewDocument } from "../types/interview.types.js";

const interviewSchema = new Schema<IInterviewDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true // V1: One interview per application
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    meetingType: {
      type: String,
      enum: ["Google Meet", "Zoom", "Microsoft Teams", "Other"],
      required: true
    },
    meetingLink: {
      type: String,
      trim: true,
      default: ""
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true,
      trim: true
    },
    endTime: {
      type: String,
      required: true,
      trim: true
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
      default: "UTC"
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Indexes
interviewSchema.index({ applicationId: 1 }, { unique: true });
interviewSchema.index({ jobId: 1 });
interviewSchema.index({ candidateId: 1 });
interviewSchema.index({ recruiterId: 1 });
interviewSchema.index({ companyId: 1 });
interviewSchema.index({ status: 1 });

const Interview = mongoose.model<IInterviewDocument>("Interview", interviewSchema);

export default Interview;
export { Interview };
