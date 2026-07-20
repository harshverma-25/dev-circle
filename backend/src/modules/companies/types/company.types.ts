import { Document, Types } from "mongoose";

export interface ICompany {
  name: string;
  slug: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  website?: string;
  description?: string;
  logo?: {
    url: string;
    publicId: string;
  };
  banner?: {
    url: string;
    publicId: string;
  };
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  verificationStatus: "Pending" | "Verified" | "Rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICompanyDocument extends ICompany, Document<Types.ObjectId> {}

export interface ICompanyMember {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  role: "Owner" | "Admin" | "Recruiter";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICompanyMemberDocument extends ICompanyMember, Document<Types.ObjectId> {}
