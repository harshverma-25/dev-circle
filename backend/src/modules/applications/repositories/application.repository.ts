import { Application } from "../models/application.model.js";
import { IApplicationDocument, IApplication } from "../types/application.types.js";
import { Types } from "mongoose";

export class ApplicationRepository {
  async findById(id: string | Types.ObjectId): Promise<IApplicationDocument | null> {
    return Application.findById(id)
      .populate("jobId", "title slug status")
      .populate("candidateId", "name email avatar");
  }

  async findByJobAndCandidate(
    jobId: string | Types.ObjectId,
    candidateId: string | Types.ObjectId
  ): Promise<IApplicationDocument | null> {
    return Application.findOne({ jobId, candidateId });
  }

  async create(applicationData: Partial<IApplication>): Promise<IApplicationDocument> {
    return Application.create(applicationData);
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: IApplication["status"]
  ): Promise<IApplicationDocument | null> {
    return Application.findByIdAndUpdate(id, { $set: { status } }, { new: true });
  }

  async delete(id: string | Types.ObjectId): Promise<IApplicationDocument | null> {
    return Application.findByIdAndDelete(id);
  }

  async findByCandidate(candidateId: string | Types.ObjectId): Promise<IApplicationDocument[]> {
    return Application.find({ candidateId })
      .populate("jobId", "title slug status location jobType workMode")
      .populate("companyId", "name slug logo")
      .sort({ createdAt: -1 });
  }

  async findByJob(jobId: string | Types.ObjectId): Promise<IApplicationDocument[]> {
    return Application.find({ jobId })
      .populate("candidateId", "name email avatar")
      .sort({ createdAt: -1 });
  }

  async findByCompany(companyId: string | Types.ObjectId): Promise<IApplicationDocument[]> {
    return Application.find({ companyId })
      .populate("jobId", "title slug status")
      .populate("candidateId", "name email avatar")
      .sort({ createdAt: -1 });
  }
}
