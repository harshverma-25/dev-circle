import { Request, Response, NextFunction } from "express";
import { InterviewService } from "../services/interview.service.js";

const interviewService = new InterviewService();

export class InterviewController {
  async scheduleInterview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interview = await interviewService.scheduleInterview(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Interview scheduled successfully.",
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async rescheduleInterview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const interviewId = req.params.id as string;
      const userId = req.user!.userId;
      const interview = await interviewService.rescheduleInterview(interviewId, userId, req.body);
      res.status(200).json({
        success: true,
        message: "Interview rescheduled successfully.",
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelInterview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const interviewId = req.params.id as string;
      const userId = req.user!.userId;
      const interview = await interviewService.cancelInterview(interviewId, userId);
      res.status(200).json({
        success: true,
        message: "Interview cancelled successfully.",
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async completeInterview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const interviewId = req.params.id as string;
      const userId = req.user!.userId;
      const interview = await interviewService.completeInterview(interviewId, userId);
      res.status(200).json({
        success: true,
        message: "Interview completed successfully.",
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterviewDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const interviewId = req.params.id as string;
      const userId = req.user!.userId;
      const interview = await interviewService.getInterviewDetails(interviewId, userId);
      res.status(200).json({
        success: true,
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async getCandidateInterviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interviews = await interviewService.getCandidateInterviews(userId);
      res.status(200).json({
        success: true,
        data: interviews
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecruiterInterviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interviews = await interviewService.getRecruiterInterviews(userId);
      res.status(200).json({
        success: true,
        data: interviews
      });
    } catch (error) {
      next(error);
    }
  }
}
