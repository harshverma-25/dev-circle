import { Document, Types } from "mongoose";

export interface IJob {
  title: string;
  slug: string;
  companyId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  description: string;
  responsibilities?: string;
  requirements?: string;
  skills: string[];
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  jobType: "Full Time" | "Internship" | "Part Time" | "Contract";
  experienceLevel: "Fresher" | "0–1 Years" | "1–3 Years" | "3–5 Years" | "5+ Years";
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  openings: number;
  applicationDeadline?: Date;
  status: "Draft" | "Published" | "Closed" | "Archived";
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJobDocument extends IJob, Document<Types.ObjectId> {}
