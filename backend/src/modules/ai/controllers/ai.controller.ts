import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service.js";
import { AuthorizationError } from "../../../shared/errors/custom.error.js";

const aiService = new AIService();

export class AIController {
  async analyzeResume(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "student") {
        throw new AuthorizationError("Only candidate students can analyze their resumes");
      }
      const result = await aiService.analyzeResume(req.user!.userId, req.file);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getATSScore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "student") {
        throw new AuthorizationError("Only candidate students can get ATS scores");
      }
      const result = await aiService.getATSScore(req.user!.userId, req.file);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getResumeSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "student") {
        throw new AuthorizationError("Only candidate students can summarize their resumes");
      }
      const result = await aiService.getResumeSummary(req.user!.userId, req.file);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSkillGap(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "student") {
        throw new AuthorizationError("Only candidate students can perform skill gap analysis");
      }
      const { jobId, jobDescription } = req.body;
      const result = await aiService.getSkillGap(req.user!.userId, jobId, jobDescription, req.file);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rankCandidates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "recruiter") {
        throw new AuthorizationError("Only recruiters can rank candidates");
      }
      const { jobId } = req.body;
      const result = await aiService.rankCandidates(req.user!.userId, jobId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async generateInterviewQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "recruiter") {
        throw new AuthorizationError("Only recruiters can generate interview questions");
      }
      const { jobId, candidateId } = req.body;
      const result = await aiService.generateInterviewQuestions(req.user!.userId, jobId, candidateId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async generateJobDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "recruiter") {
        throw new AuthorizationError("Only recruiters can generate job descriptions");
      }
      const { jobTitle, experience, skills } = req.body;
      const result = await aiService.generateJobDescription(req.user!.userId, jobTitle, experience, skills);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async careerCoach(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "student") {
        throw new AuthorizationError("Only candidate students can use the career coach feature");
      }
      const { goal } = req.body;
      const result = await aiService.careerCoach(req.user!.userId, goal, req.file);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
