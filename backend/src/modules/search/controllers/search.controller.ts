import { Request, Response, NextFunction } from "express";
import { SearchService } from "../services/search.service.js";
import { AuthorizationError } from "../../../shared/errors/custom.error.js";

const searchService = new SearchService();

export class SearchController {
  async searchJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await searchService.searchJobs(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async searchDevelopers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user!.role !== "recruiter" && req.user!.role !== "admin") {
        throw new AuthorizationError("Only recruiters and admins can search developers");
      }
      const result = await searchService.searchDevelopers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async searchCompanies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await searchService.searchCompanies(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getSuggestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q, type } = req.query;
      const suggestions = await searchService.getSuggestions(
        String(q || ""),
        type ? String(type) : undefined
      );
      res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
      next(error);
    }
  }
}
