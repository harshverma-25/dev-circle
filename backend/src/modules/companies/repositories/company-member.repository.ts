import { CompanyMember } from "../models/company-member.model.js";
import { ICompanyMemberDocument, ICompanyMember } from "../types/company.types.js";
import { Types } from "mongoose";

export class CompanyMemberRepository {
  async findById(id: string | Types.ObjectId): Promise<ICompanyMemberDocument | null> {
    return CompanyMember.findById(id);
  }

  async findMember(
    companyId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<ICompanyMemberDocument | null> {
    return CompanyMember.findOne({ companyId, userId });
  }

  async findMembersByCompanyId(
    companyId: string | Types.ObjectId
  ): Promise<ICompanyMemberDocument[]> {
    return CompanyMember.find({ companyId }).populate("userId", "name email role avatar profilePicture");
  }

  async findCompaniesByUserId(
    userId: string | Types.ObjectId
  ): Promise<ICompanyMemberDocument[]> {
    return CompanyMember.find({ userId }).populate("companyId", "name slug logo verificationStatus");
  }

  async create(memberData: Partial<ICompanyMember>): Promise<ICompanyMemberDocument> {
    return CompanyMember.create(memberData);
  }

  async updateRole(
    companyId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    role: "Owner" | "Admin" | "Recruiter"
  ): Promise<ICompanyMemberDocument | null> {
    return CompanyMember.findOneAndUpdate(
      { companyId, userId },
      { $set: { role } },
      { new: true }
    );
  }

  async deleteMember(
    companyId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<ICompanyMemberDocument | null> {
    return CompanyMember.findOneAndDelete({ companyId, userId });
  }
}
