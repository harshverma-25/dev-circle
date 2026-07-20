import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service.js";
import { AuthorizationError } from "../../../shared/errors/custom.error.js";

const adminService = new AdminService();

export class AdminController {
  private checkAdmin(req: Request) {
    if (req.user!.role !== "admin") {
      throw new AuthorizationError("Only administrators are authorized to access this resource");
    }
  }

  async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const result = await adminService.getDashboardStats();
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const result = await adminService.getUsers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async banUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.banUser(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async activateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.activateUser(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.deleteUser(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getCompanies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const result = await adminService.getCompanies(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async verifyCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.verifyCompany(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async rejectCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.rejectCompany(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.deleteCompany(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const result = await adminService.getJobs(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.deleteJob(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async closeJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.checkAdmin(req);
      const { id } = req.params;
      const result = await adminService.closeJob(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
