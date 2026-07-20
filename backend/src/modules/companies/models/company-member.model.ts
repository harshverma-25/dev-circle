import mongoose, { Schema } from "mongoose";
import { ICompanyMemberDocument } from "../types/company.types.js";

const companyMemberSchema = new Schema<ICompanyMemberDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Recruiter"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes to enforce single role per company and facilitate quick queries
companyMemberSchema.index({ companyId: 1, userId: 1 }, { unique: true });
companyMemberSchema.index({ userId: 1 });

const CompanyMember = mongoose.model<ICompanyMemberDocument>(
  "CompanyMember",
  companyMemberSchema
);

export default CompanyMember;
export { CompanyMember };
