import { Request, Response, NextFunction } from "express";
import { ApplicationService } from "../services/application.service.js";

const applicationService = new ApplicationService();

export class ApplicationController {
  async apply(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.body;
      const application = await applicationService.apply(userId, jobId);
      res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const applications = await applicationService.getMyApplications(userId);
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      const applications = await applicationService.getJobApplications(jobId, userId);
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.applicationId as string;
      const userId = req.user!.userId;
      const application = await applicationService.getApplicationDetails(applicationId, userId);
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.applicationId as string;
      const userId = req.user!.userId;
      const { status } = req.body;
      const application = await applicationService.updateStatus(applicationId, userId, status);
      res.status(200).json({
        success: true,
        message: "Application status updated successfully.",
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  async withdrawApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.applicationId as string;
      const userId = req.user!.userId;
      await applicationService.withdrawApplication(applicationId, userId);
      res.status(200).json({
        success: true,
        message: "Application withdrawn successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
