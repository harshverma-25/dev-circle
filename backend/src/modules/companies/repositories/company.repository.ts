import { Company } from "../models/company.model.js";
import { ICompanyDocument, ICompany } from "../types/company.types.js";
import { Types } from "mongoose";

export class CompanyRepository {
  async findById(id: string | Types.ObjectId): Promise<ICompanyDocument | null> {
    return Company.findById(id);
  }

  async findBySlug(slug: string): Promise<ICompanyDocument | null> {
    return Company.findOne({ slug: slug.toLowerCase() });
  }

  async findByName(name: string): Promise<ICompanyDocument | null> {
    return Company.findOne({ name });
  }

  async create(companyData: Partial<ICompany>): Promise<ICompanyDocument> {
    return Company.create(companyData);
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<ICompany>
  ): Promise<ICompanyDocument | null> {
    return Company.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }
}
