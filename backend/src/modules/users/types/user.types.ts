import { Document, Types } from "mongoose";

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear: number;
  endYear?: number;
  cgpa?: number;
}

export interface IExperience {
  company: string;
  role: string;
  employmentType?: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  codeforces?: string;
  hackerrank?: string;
}

export interface IProfilePicture {
  url: string;
  publicId: string;
}

export interface IUser {
  name: string;
  email: string;
  username?: string;
  password?: string;
  googleId?: string | null;
  avatar?: string | null;
  provider: "local" | "google";
  role: "student" | "recruiter" | "admin";
  isVerified: boolean;
  
  // Profile fields
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profilePicture?: IProfilePicture;
  skills: string[];
  education: IEducation[];
  experience: IExperience[];
  socialLinks?: ISocialLinks;
  
  // ATS tracking fields to avoid breaking changes
  atsUsageCount?: number;
  lastAtsUsageTimestamp?: Date | null;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document<Types.ObjectId> {}
