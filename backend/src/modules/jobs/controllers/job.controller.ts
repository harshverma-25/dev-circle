import { Request, Response, NextFunction } from "express";
import { JobService } from "../services/job.service.js";
import jwt from "jsonwebtoken";

const jobService = new JobService();

const getOptionalUserId = (req: Request): string | undefined => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET || "fallback_secret";
      const decoded = jwt.verify(token, secret) as any;
      return decoded.userId;
    }
  } catch (e) {
    // Ignore and fallback
  }
  return undefined;
};

export class JobController {
  async createJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const job = await jobService.createJob(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Job created successfully.",
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async updateJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      const job = await jobService.updateJob(jobId, userId, req.body);
      res.status(200).json({
        success: true,
        message: "Job updated successfully.",
        data: job
      });
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
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      await jobService.deleteJob(jobId, userId);
      res.status(200).json({
        success: true,
        message: "Job deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const userId = getOptionalUserId(req);
      const job = await jobService.getJobBySlug(slug, userId);
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async searchJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        skills: req.query.skills as string,
        location: req.query.location as string,
        jobType: req.query.jobType as string,
        workMode: req.query.workMode as string,
        experienceLevel: req.query.experienceLevel as string,
        salaryMin: req.query.salaryMin ? Number(req.query.salaryMin) : undefined,
        salaryMax: req.query.salaryMax ? Number(req.query.salaryMax) : undefined,
        companyId: req.query.companyId as string
      };

      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sort: req.query.sort as string
      };

      const result = await jobService.searchJobs(filters, pagination);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async publishJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      const job = await jobService.publishJob(jobId, userId);
      res.status(200).json({
        success: true,
        message: "Job published successfully.",
        data: job
      });
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
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      const job = await jobService.closeJob(jobId, userId);
      res.status(200).json({
        success: true,
        message: "Job closed successfully.",
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const userId = req.user!.userId;
      const job = await jobService.archiveJob(jobId, userId);
      res.status(200).json({
        success: true,
        message: "Job archived successfully.",
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.params.companyId as string;
      const userId = getOptionalUserId(req);
      const jobs = await jobService.getCompanyJobs(companyId, userId);
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const jobs = await jobService.getRecruiterJobs(userId);
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      next(error);
    }
  }
}
