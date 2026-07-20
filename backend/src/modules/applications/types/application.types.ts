import { Document, Types } from "mongoose";

export interface IResumeSnapshot {
  url: string;
  publicId: string;
  uploadedAt?: Date;
}

export interface IEducationSnapshot {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear: number;
  endYear?: number;
  cgpa?: number;
}

export interface IExperienceSnapshot {
  company: string;
  role: string;
  employmentType?: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
}

export interface ICandidateSnapshot {
  name: string;
  email: string;
  avatar?: string | null;
  headline?: string;
  skills: string[];
  education: IEducationSnapshot[];
  experience: IExperienceSnapshot[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    leetcode?: string;
    codeforces?: string;
    hackerrank?: string;
  };
}

export interface IApplication {
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  companyId: Types.ObjectId;
  status: "Applied" | "Under Review" | "Interview Scheduled" | "Interview Completed" | "Offer" | "Accepted" | "Rejected";
  resumeSnapshot: IResumeSnapshot;
  candidateSnapshot: ICandidateSnapshot;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IApplicationDocument extends IApplication, Document<Types.ObjectId> {}
