import { Document, Types } from "mongoose";

export interface IInterview {
  applicationId: Types.ObjectId;
  jobId: Types.ObjectId;
  companyId: Types.ObjectId;
  candidateId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  meetingType: "Google Meet" | "Zoom" | "Microsoft Teams" | "Other";
  meetingLink?: string;
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInterviewDocument extends IInterview, Document<Types.ObjectId> {}
