import { Document, Types } from "mongoose";

export interface IRefreshToken {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document<Types.ObjectId> {}

export interface IEmailVerification {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEmailVerificationDocument extends IEmailVerification, Document<Types.ObjectId> {}
