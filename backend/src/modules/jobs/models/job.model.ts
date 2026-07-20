import mongoose, { Schema } from "mongoose";
import { IJobDocument } from "../types/job.types.js";

const jobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    responsibilities: {
      type: String,
      default: ""
    },
    requirements: {
      type: String,
      default: ""
    },
    skills: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      required: true
    },
    jobType: {
      type: String,
      enum: ["Full Time", "Internship", "Part Time", "Contract"],
      required: true
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "0–1 Years", "1–3 Years", "3–5 Years", "5+ Years"],
      required: true
    },
    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: "USD" }
    },
    openings: {
      type: Number,
      default: 1
    },
    applicationDeadline: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Closed", "Archived"],
      default: "Draft"
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
jobSchema.index({ companyId: 1 });
jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ status: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ title: "text", description: "text" }); // Text index for full-text search

// Pre-save hook to generate unique slugs automatically
jobSchema.pre("save", async function (this: IJobDocument) {
  if (!this.slug) {
    let base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!base) {
      base = "job";
    }

    let slug = base;
    let count = 1;
    const model = this.constructor as any;

    let exists = await model.findOne({ slug });
    while (exists) {
      slug = `${base}-${count}`;
      count++;
      exists = await model.findOne({ slug });
    }

    this.slug = slug;
  }

  // Handle publishedAt timestamp
  if (this.status === "Published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Job = mongoose.model<IJobDocument>("Job", jobSchema);

export default Job;
export { Job };
