import { Resume } from "../models/resume.model.js";
import { IResumeDocument } from "../types/resume.types.js";
import { Types } from "mongoose";

export class ResumeRepository {
  async findByUserId(userId: string | Types.ObjectId): Promise<IResumeDocument | null> {
    return Resume.findOne({ userId });
  }

  async create(
    userId: string | Types.ObjectId,
    url: string,
    publicId: string
  ): Promise<IResumeDocument> {
    return Resume.create({
      userId,
      url,
      publicId
    });
  }

  async deleteByUserId(userId: string | Types.ObjectId): Promise<IResumeDocument | null> {
    return Resume.findOneAndDelete({ userId });
  }
}
