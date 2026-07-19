import { EmailVerification } from "../models/email-verification.model.js";
import { IEmailVerificationDocument } from "../types/auth.types.js";
import { Types } from "mongoose";

export class EmailVerificationRepository {
  async create(
    userId: string | Types.ObjectId,
    token: string,
    expiresAt: Date
  ): Promise<IEmailVerificationDocument> {
    return EmailVerification.create({
      userId,
      token,
      expiresAt
    });
  }

  async findByToken(token: string): Promise<IEmailVerificationDocument | null> {
    return EmailVerification.findOne({ token });
  }

  async deleteByToken(token: string): Promise<void> {
    await EmailVerification.deleteOne({ token });
  }

  async deleteByUserId(userId: string | Types.ObjectId): Promise<void> {
    await EmailVerification.deleteMany({ userId });
  }
}
