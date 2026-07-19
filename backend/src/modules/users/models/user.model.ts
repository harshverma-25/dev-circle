import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "../types/user.types.js";

const educationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  cgpa: { type: Number }
});

const experienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  employmentType: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String }
});

const socialLinksSchema = new Schema({
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  leetcode: { type: String, default: "" },
  codeforces: { type: String, default: "" },
  hackerrank: { type: String, default: "" }
});

const profilePictureSchema = new Schema({
  url: { type: String, default: "" },
  publicId: { type: String, default: "" }
});

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function (this: IUserDocument) {
        return this.provider === "local";
      }
    },
    googleId: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    
    // Profile Fields
    headline: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    profilePicture: {
      type: profilePictureSchema,
      default: () => ({})
    },
    skills: {
      type: [String],
      default: []
    },
    education: {
      type: [educationSchema],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({})
    },
    
    // ATS tracking
    atsUsageCount: {
      type: Number,
      default: 0
    },
    lastAtsUsageTimestamp: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Pre-save hook to generate unique usernames automatically
userSchema.pre("save", async function (this: IUserDocument) {
  if (!this.username) {
    let base = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!base) {
      base = "user";
    }

    let username = base;
    let count = 1;
    const model = this.constructor as any;
    
    let exists = await model.findOne({ username });
    while (exists) {
      username = `${base}-${count}`;
      count++;
      exists = await model.findOne({ username });
    }
    
    this.username = username;
  }
});

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
export { User };
