import { Request, Response, NextFunction } from "express";
import { CompanyService } from "../services/company.service.js";

const companyService = new CompanyService();

export class CompanyController {
  async createCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await companyService.createCompany(
        userId,
        userRole,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Company created successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyCompanies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const companies = await companyService.getCompaniesForRecruiter(userId);
      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const company = await companyService.getPublicCompanyProfile(slug);
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      await companyService.updateCompanyProfile(companyId, userId, req.body);
      res.status(200).json({
        success: true,
        message: "Company updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadLogo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      await companyService.uploadLogo(companyId, userId, req.file);
      res.status(200).json({
        success: true,
        message: "Logo uploaded successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLogo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      await companyService.deleteLogo(companyId, userId);
      res.status(200).json({
        success: true,
        message: "Logo deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadBanner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      await companyService.uploadBanner(companyId, userId, req.file);
      res.status(200).json({
        success: true,
        message: "Banner uploaded successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBanner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      await companyService.deleteBanner(companyId, userId);
      res.status(200).json({
        success: true,
        message: "Banner deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = req.user!.userId;
      const members = await companyService.getCompanyMembers(companyId, userId);
      res.status(200).json({
        success: true,
        data: members
      });
    } catch (error) {
      next(error);
    }
  }

  async inviteRecruiter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const inviterId = req.user!.userId;
      const { email, role } = req.body;
      await companyService.inviteRecruiter(companyId, inviterId, email, role);
      res.status(200).json({
        success: true,
        message: "Recruiter added successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const memberId = req.params.memberId as string;
      const actorId = req.user!.userId;
      const { role } = req.body;
      await companyService.updateMemberRole(
        companyId,
        actorId,
        memberId,
        role
      );
      res.status(200).json({
        success: true,
        message: "Role updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const memberId = req.params.memberId as string;
      const actorId = req.user!.userId;
      await companyService.removeMember(companyId, actorId, memberId);
      res.status(200).json({
        success: true,
        message: "Recruiter removed successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
