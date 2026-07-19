import { Document, Types } from "mongoose";

export interface IResume {
  userId: Types.ObjectId;
  url: string;
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResumeDocument extends IResume, Document<Types.ObjectId> {}
