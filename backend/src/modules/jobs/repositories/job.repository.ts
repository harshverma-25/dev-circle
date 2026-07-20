import { Job } from "../models/job.model.js";
import { IJobDocument, IJob } from "../types/job.types.js";
import { Types } from "mongoose";

export class JobRepository {
  async findById(id: string | Types.ObjectId): Promise<IJobDocument | null> {
    return Job.findById(id).populate("companyId", "name slug logo");
  }

  async findBySlug(slug: string): Promise<IJobDocument | null> {
    return Job.findOne({ slug: slug.toLowerCase() })
      .populate("companyId", "name slug logo industry website location")
      .populate("recruiterId", "name email");
  }

  async create(jobData: Partial<IJob>): Promise<IJobDocument> {
    return Job.create(jobData);
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<IJob>
  ): Promise<IJobDocument | null> {
    return Job.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async delete(id: string | Types.ObjectId): Promise<IJobDocument | null> {
    return Job.findByIdAndDelete(id);
  }

  async findAndCount(
    filters: {
      search?: string;
      skills?: string[];
      location?: string;
      jobType?: string;
      workMode?: string;
      experienceLevel?: string;
      salaryMin?: number;
      salaryMax?: number;
      companyId?: string | Types.ObjectId;
      recruiterId?: string | Types.ObjectId;
      status?: string;
    },
    options: {
      page?: number;
      limit?: number;
      sort?: string;
    }
  ): Promise<{ jobs: IJobDocument[]; total: number }> {
    const query: any = {};

    // Apply status filter (defaults to Published if not specified for public searches, but managed in service)
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.companyId) {
      query.companyId = filters.companyId;
    }

    if (filters.recruiterId) {
      query.recruiterId = filters.recruiterId;
    }

    if (filters.jobType) {
      query.jobType = filters.jobType;
    }

    if (filters.workMode) {
      query.workMode = filters.workMode;
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.skills && filters.skills.length > 0) {
      // Matches jobs with any of the requested skills (case-insensitive regex)
      query.skills = {
        $in: filters.skills.map((s) => new RegExp(`^${s.trim()}$`, "i"))
      };
    }

    if (filters.salaryMin !== undefined) {
      query["salary.min"] = { $gte: filters.salaryMin };
    }

    if (filters.salaryMax !== undefined) {
      query["salary.max"] = { $lte: filters.salaryMax };
    }

    if (filters.search) {
      // Simple text search or fallback regex on title/description
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } }
      ];
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // Sorting definition
    let sortQuery: any = { createdAt: -1 }; // Default: newest first
    if (options.sort) {
      if (options.sort === "salary_asc") {
        sortQuery = { "salary.min": 1 };
      } else if (options.sort === "salary_desc") {
        sortQuery = { "salary.max": -1 };
      } else if (options.sort === "oldest") {
        sortQuery = { createdAt: 1 };
      } else if (options.sort === "published") {
        sortQuery = { publishedAt: -1 };
      } else {
        const sortField = options.sort.startsWith("-") ? options.sort.substring(1) : options.sort;
        const sortOrder = options.sort.startsWith("-") ? -1 : 1;
        sortQuery = { [sortField]: sortOrder };
      }
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("companyId", "name slug logo location industry");

    return { jobs, total };
  }
}
