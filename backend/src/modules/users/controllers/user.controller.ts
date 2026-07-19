import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await userService.getProfile(userId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await userService.updateProfile(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { skills } = req.body;
      await userService.updateSkills(userId, skills);
      res.status(200).json({
        success: true,
        message: "Skills updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { education } = req.body;
      await userService.updateEducation(userId, education);
      res.status(200).json({
        success: true,
        message: "Education updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { experience } = req.body;
      await userService.updateExperience(userId, experience);
      res.status(200).json({
        success: true,
        message: "Experience updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSocialLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await userService.updateSocialLinks(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Social links updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeData = await userService.uploadResume(userId, req.file);
      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully.",
        data: resumeData
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await userService.deleteResume(userId);
      res.status(200).json({
        success: true,
        message: "Resume deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await userService.uploadProfilePicture(userId, req.file);
      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await userService.deleteProfilePicture(userId);
      res.status(200).json({
        success: true,
        message: "Profile picture deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = req.params.username as string;
      const profile = await userService.getPublicProfile(username);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }
}
