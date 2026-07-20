import mongoose, { Schema } from "mongoose";
import { ICompanyDocument } from "../types/company.types.js";

const logoSchema = new Schema({
  url: { type: String, default: "" },
  publicId: { type: String, default: "" }
});

const bannerSchema = new Schema({
  url: { type: String, default: "" },
  publicId: { type: String, default: "" }
});

const locationSchema = new Schema({
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" }
});

const socialLinksSchema = new Schema({
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" }
});

const companySchema = new Schema<ICompanyDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    industry: {
      type: String,
      default: ""
    },
    companySize: {
      type: String,
      default: ""
    },
    foundedYear: {
      type: Number,
      default: null
    },
    website: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    logo: {
      type: logoSchema,
      default: () => ({})
    },
    banner: {
      type: bannerSchema,
      default: () => ({})
    },
    location: {
      type: locationSchema,
      default: () => ({})
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({})
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

// Indexes
companySchema.index({ name: 1 }, { unique: true });
companySchema.index({ slug: 1 }, { unique: true });

// Pre-save hook to generate unique slugs automatically
companySchema.pre("save", async function (this: ICompanyDocument) {
  if (!this.slug) {
    let base = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!base) {
      base = "company";
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
});

const Company = mongoose.model<ICompanyDocument>("Company", companySchema);

export default Company;
export { Company };
