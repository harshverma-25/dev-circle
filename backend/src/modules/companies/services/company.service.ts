import { CompanyRepository } from "../repositories/company.repository.js";
import { CompanyMemberRepository } from "../repositories/company-member.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { CustomError, AuthorizationError } from "../../../shared/errors/custom.error.js";
// @ts-ignore
import cloudinary from "../../../config/cloudinary.js";
import { ICompany, ICompanyMember } from "../types/company.types.js";
import { Types } from "mongoose";

export class CompanyService {
  private companyRepo = new CompanyRepository();
  private memberRepo = new CompanyMemberRepository();
  private userRepo = new UserRepository();

  async createCompany(
    userId: string,
    userRole: string,
    companyData: Partial<ICompany>
  ): Promise<{ companyId: string; slug: string }> {
    // Only recruiters can create companies
    if (userRole !== "recruiter") {
      throw new AuthorizationError("Only recruiters can create companies");
    }

    // Verify company name is unique
    const existing = await this.companyRepo.findByName(companyData.name!);
    if (existing) {
      throw new CustomError(
        "Company name already exists",
        409,
        "COMPANY_ALREADY_EXISTS"
      );
    }

    // Create the company
    const newCompany = await this.companyRepo.create({
      ...companyData,
      verificationStatus: "Pending"
    });

    // Make the creator the Owner
    await this.memberRepo.create({
      companyId: newCompany._id,
      userId: new Types.ObjectId(userId),
      role: "Owner"
    });

    return {
      companyId: newCompany._id.toString(),
      slug: newCompany.slug
    };
  }

  async getCompaniesForRecruiter(userId: string): Promise<any[]> {
    const memberships = await this.memberRepo.findCompaniesByUserId(userId);
    return memberships.map((membership) => {
      const company = membership.companyId as any;
      return {
        id: company._id.toString(),
        name: company.name,
        slug: company.slug,
        role: membership.role
      };
    });
  }

  async getPublicCompanyProfile(slug: string): Promise<any> {
    const company = await this.companyRepo.findBySlug(slug);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    return {
      name: company.name,
      slug: company.slug,
      industry: company.industry || "",
      companySize: company.companySize || "",
      website: company.website || "",
      description: company.description || "",
      logo: company.logo?.url
        ? {
            url: company.logo.url,
            publicId: company.logo.publicId
          }
        : {},
      banner: company.banner?.url
        ? {
            url: company.banner.url,
            publicId: company.banner.publicId
          }
        : {},
      location: company.location?.country || company.location?.city
        ? {
            country: company.location.country || "",
            city: company.location.city || ""
          }
        : {},
      verificationStatus: company.verificationStatus,
      openJobs: 0 // Jobs module is not implemented yet in V1
    };
  }

  async updateCompanyProfile(
    companyId: string,
    userId: string,
    data: Partial<ICompany>
  ): Promise<void> {
    // Authorization check: User must be Owner or Admin of the company
    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    // Filter updateable fields
    const updateData: any = {};
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.companySize !== undefined) updateData.companySize = data.companySize;
    if (data.foundedYear !== undefined) updateData.foundedYear = data.foundedYear;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks;

    await this.companyRepo.update(companyId, updateData);
  }

  async uploadLogo(
    companyId: string,
    userId: string,
    file: Express.Multer.File | undefined
  ): Promise<void> {
    if (!file) {
      throw new CustomError("Logo file is required", 400, "VALIDATION_ERROR");
    }

    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    // If an existing logo is in Cloudinary, delete it first
    if (company.logo?.publicId) {
      try {
        await cloudinary.uploader.destroy(company.logo.publicId);
      } catch (err) {
        console.error("Failed to delete old logo from Cloudinary:", err);
      }
    }

    await this.companyRepo.update(companyId, {
      logo: {
        url: file.path,
        publicId: file.filename
      }
    });
  }

  async deleteLogo(companyId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    if (!company.logo?.publicId) {
      throw new CustomError("No logo found to delete", 400, "VALIDATION_ERROR");
    }

    try {
      await cloudinary.uploader.destroy(company.logo.publicId);
    } catch (err) {
      console.error("Failed to delete logo from Cloudinary:", err);
    }

    await this.companyRepo.update(companyId, {
      logo: {
        url: "",
        publicId: ""
      }
    });
  }

  async uploadBanner(
    companyId: string,
    userId: string,
    file: Express.Multer.File | undefined
  ): Promise<void> {
    if (!file) {
      throw new CustomError("Banner file is required", 400, "VALIDATION_ERROR");
    }

    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    // If an existing banner is in Cloudinary, delete it first
    if (company.banner?.publicId) {
      try {
        await cloudinary.uploader.destroy(company.banner.publicId);
      } catch (err) {
        console.error("Failed to delete old banner from Cloudinary:", err);
      }
    }

    await this.companyRepo.update(companyId, {
      banner: {
        url: file.path,
        publicId: file.filename
      }
    });
  }

  async deleteBanner(companyId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company does not exist", 404, "COMPANY_NOT_FOUND");
    }

    if (!company.banner?.publicId) {
      throw new CustomError("No banner found to delete", 400, "VALIDATION_ERROR");
    }

    try {
      await cloudinary.uploader.destroy(company.banner.publicId);
    } catch (err) {
      console.error("Failed to delete banner from Cloudinary:", err);
    }

    await this.companyRepo.update(companyId, {
      banner: {
        url: "",
        publicId: ""
      }
    });
  }

  async getCompanyMembers(companyId: string, userId: string): Promise<any[]> {
    // User must be a member of the company to view other members
    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied");
    }

    const list = await this.memberRepo.findMembersByCompanyId(companyId);
    return list.map((item) => {
      const user = item.userId as any;
      return {
        id: user._id.toString(),
        name: user.name,
        role: item.role
      };
    });
  }

  async inviteRecruiter(
    companyId: string,
    inviterId: string,
    inviteeEmail: string,
    inviteeRole: "Admin" | "Recruiter"
  ): Promise<void> {
    // Inviter must be Owner or Admin
    const inviter = await this.memberRepo.findMember(companyId, inviterId);
    if (!inviter || (inviter.role !== "Owner" && inviter.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    // Target user must exist
    const invitee = await this.userRepo.findByEmail(inviteeEmail);
    if (!invitee) {
      throw new CustomError("Recruiter not found", 404, "MEMBER_NOT_FOUND");
    }

    // Target user must have recruiter role
    if (invitee.role !== "recruiter") {
      throw new CustomError(
        "User must have Recruiter role",
        400,
        "VALIDATION_ERROR"
      );
    }

    // Target user cannot already belong to the company
    const existingMember = await this.memberRepo.findMember(
      companyId,
      invitee._id
    );
    if (existingMember) {
      throw new CustomError(
        "Recruiter already belongs to company",
        409,
        "RECRUITER_ALREADY_EXISTS"
      );
    }

    // Create the membership
    await this.memberRepo.create({
      companyId: new Types.ObjectId(companyId),
      userId: invitee._id,
      role: inviteeRole
    });
  }

  async updateMemberRole(
    companyId: string,
    actorId: string,
    targetUserId: string,
    newRole: "Admin" | "Recruiter"
  ): Promise<void> {
    // Only Owner can change recruiter roles
    const actor = await this.memberRepo.findMember(companyId, actorId);
    if (!actor || actor.role !== "Owner") {
      throw new AuthorizationError("Permission denied");
    }

    // Target user must belong to company
    const targetMember = await this.memberRepo.findMember(
      companyId,
      targetUserId
    );
    if (!targetMember) {
      throw new CustomError("Recruiter not found", 404, "MEMBER_NOT_FOUND");
    }

    // Cannot change Owner's role via this endpoint (Owner must transfer ownership)
    if (targetMember.role === "Owner") {
      throw new CustomError(
        "Owner role cannot be changed via this endpoint",
        400,
        "VALIDATION_ERROR"
      );
    }

    await this.memberRepo.updateRole(companyId, targetUserId, newRole);
  }

  async removeMember(
    companyId: string,
    actorId: string,
    targetUserId: string
  ): Promise<void> {
    const actor = await this.memberRepo.findMember(companyId, actorId);
    if (!actor || (actor.role !== "Owner" && actor.role !== "Admin")) {
      throw new AuthorizationError("Permission denied");
    }

    const targetMember = await this.memberRepo.findMember(
      companyId,
      targetUserId
    );
    if (!targetMember) {
      throw new CustomError("Recruiter not found", 404, "MEMBER_NOT_FOUND");
    }

    // Owner cannot be removed
    if (targetMember.role === "Owner") {
      throw new CustomError(
        "Owner cannot be removed from the company",
        400,
        "VALIDATION_ERROR"
      );
    }

    await this.memberRepo.deleteMember(companyId, targetUserId);
  }
}
