import { RefreshToken } from "../models/refresh-token.model.js";
import { IRefreshTokenDocument } from "../types/auth.types.js";
import { Types } from "mongoose";

export class RefreshTokenRepository {
  async create(
    userId: string | Types.ObjectId,
    token: string,
    expiresAt: Date
  ): Promise<IRefreshTokenDocument> {
    return RefreshToken.create({
      userId,
      token,
      expiresAt
    });
  }

  async findByToken(token: string): Promise<IRefreshTokenDocument | null> {
    return RefreshToken.findOne({ token });
  }

  async deleteByToken(token: string): Promise<void> {
    await RefreshToken.deleteOne({ token });
  }

  async deleteByUserId(userId: string | Types.ObjectId): Promise<void> {
    await RefreshToken.deleteMany({ userId });
  }
}
