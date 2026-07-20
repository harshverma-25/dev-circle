import mongoose, { Schema } from "mongoose";
import { IApplicationDocument } from "../types/application.types.js";

const resumeSnapshotSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedAt: { type: Date }
}, { _id: false });

const educationSnapshotSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  cgpa: { type: Number }
}, { _id: false });

const experienceSnapshotSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  employmentType: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String }
}, { _id: false });

const candidateSnapshotSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: null },
  headline: { type: String, default: "" },
  skills: { type: [String], default: [] },
  education: { type: [educationSnapshotSchema], default: [] },
  experience: { type: [experienceSnapshotSchema], default: [] },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    hackerrank: { type: String, default: "" }
  }
}, { _id: false });

const applicationSchema = new Schema<IApplicationDocument>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Interview Scheduled",
        "Interview Completed",
        "Offer",
        "Accepted",
        "Rejected"
      ],
      default: "Applied"
    },
    resumeSnapshot: {
      type: resumeSnapshotSchema,
      required: true
    },
    candidateSnapshot: {
      type: candidateSnapshotSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// candidate can only apply once per job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model<IApplicationDocument>("Application", applicationSchema);

export default Application;
export { Application };
