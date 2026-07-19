import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  googleId?: string | null;
  avatar?: string | null;
  provider: "local" | "google";
  role: "student" | "recruiter" | "admin";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document<Types.ObjectId> {}
