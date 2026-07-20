import { Interview } from "../models/interview.model.js";
import { IInterviewDocument, IInterview } from "../types/interview.types.js";
import { Types } from "mongoose";

export class InterviewRepository {
  async findById(id: string | Types.ObjectId): Promise<IInterviewDocument | null> {
    return Interview.findById(id)
      .populate("applicationId")
      .populate("jobId", "title slug status")
      .populate("companyId", "name slug logo")
      .populate("candidateId", "name email avatar")
      .populate("recruiterId", "name email");
  }

  async findByApplicationId(applicationId: string | Types.ObjectId): Promise<IInterviewDocument | null> {
    return Interview.findOne({ applicationId });
  }

  async create(interviewData: Partial<IInterview>): Promise<IInterviewDocument> {
    return Interview.create(interviewData);
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<IInterview>
  ): Promise<IInterviewDocument | null> {
    return Interview.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async delete(id: string | Types.ObjectId): Promise<IInterviewDocument | null> {
    return Interview.findByIdAndDelete(id);
  }

  async findByCandidate(candidateId: string | Types.ObjectId): Promise<IInterviewDocument[]> {
    return Interview.find({ candidateId })
      .populate("jobId", "title slug status location jobType workMode")
      .populate("companyId", "name slug logo")
      .populate("recruiterId", "name email")
      .sort({ date: 1, startTime: 1 });
  }

  async findByRecruiter(recruiterId: string | Types.ObjectId): Promise<IInterviewDocument[]> {
    return Interview.find({ recruiterId })
      .populate("jobId", "title slug status location jobType workMode")
      .populate("companyId", "name slug logo")
      .populate("candidateId", "name email avatar")
      .sort({ date: 1, startTime: 1 });
  }

  async findByCompany(companyId: string | Types.ObjectId): Promise<IInterviewDocument[]> {
    return Interview.find({ companyId })
      .populate("jobId", "title slug status")
      .populate("candidateId", "name email avatar")
      .populate("recruiterId", "name email")
      .sort({ date: 1, startTime: 1 });
  }
}
