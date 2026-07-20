import { JobRepository } from "../repositories/job.repository.js";
import { CompanyMemberRepository } from "../../companies/repositories/company-member.repository.js";
import { CompanyRepository } from "../../companies/repositories/company.repository.js";
import { CustomError, AuthorizationError } from "../../../shared/errors/custom.error.js";
import { IJob } from "../types/job.types.js";
import { Types } from "mongoose";

export class JobService {
  private jobRepo = new JobRepository();
  private memberRepo = new CompanyMemberRepository();
  private companyRepo = new CompanyRepository();

  async createJob(
    userId: string,
    jobData: Partial<IJob>
  ): Promise<any> {
    const { companyId } = jobData;
    if (!companyId) {
      throw new CustomError("Company ID is required", 400, "INVALID_JOB");
    }

    // Verify company exists
    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CustomError("Company not found", 404, "COMPANY_NOT_FOUND");
    }

    // Only Company Owner, Admin, and Recruiter can create jobs
    const member = await this.memberRepo.findMember(companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: You must be a company member to post jobs");
    }

    const job = await this.jobRepo.create({
      ...jobData,
      recruiterId: new Types.ObjectId(userId),
      status: jobData.status || "Draft"
    });

    return job;
  }

  async updateJob(
    jobId: string,
    userId: string,
    updateData: Partial<IJob>
  ): Promise<any> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    // Only Company Owner, Admin, and Recruiter can manage jobs
    const member = await this.memberRepo.findMember(job.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: You do not have permission to manage this job");
    }

    // Archived jobs are read-only
    if (job.status === "Archived") {
      throw new CustomError("Archived jobs are read-only", 400, "JOB_ARCHIVED");
    }

    // Prevent direct status modification through general updates (force using status endpoints)
    if (updateData.status && updateData.status !== job.status) {
      delete updateData.status;
    }

    const updatedJob = await this.jobRepo.update(jobId, updateData);
    return updatedJob;
  }

  async deleteJob(jobId: string, userId: string): Promise<void> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: You do not have permission to delete this job");
    }

    await this.jobRepo.delete(jobId);
  }

  async getJobBySlug(slug: string, userId?: string): Promise<any> {
    const job = await this.jobRepo.findBySlug(slug);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    // Draft jobs are invisible to the public
    if (job.status === "Draft") {
      if (!userId) {
        throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
      }
      const member = await this.memberRepo.findMember(job.companyId._id, userId);
      if (!member) {
        throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
      }
    }

    return job;
  }

  async publishJob(jobId: string, userId: string): Promise<any> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId._id, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied");
    }

    if (job.status === "Archived") {
      throw new CustomError("Archived jobs cannot be published", 400, "JOB_ARCHIVED");
    }

    const updatedJob = await this.jobRepo.update(jobId, {
      status: "Published",
      publishedAt: new Date()
    });

    return updatedJob;
  }

  async closeJob(jobId: string, userId: string): Promise<any> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId._id, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied");
    }

    if (job.status === "Archived") {
      throw new CustomError("Archived jobs cannot be closed", 400, "JOB_ARCHIVED");
    }

    const updatedJob = await this.jobRepo.update(jobId, { status: "Closed" });
    return updatedJob;
  }

  async archiveJob(jobId: string, userId: string): Promise<any> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId._id, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied");
    }

    const updatedJob = await this.jobRepo.update(jobId, { status: "Archived" });
    return updatedJob;
  }

  async searchJobs(
    filters: {
      search?: string;
      skills?: string;
      location?: string;
      jobType?: string;
      workMode?: string;
      experienceLevel?: string;
      salaryMin?: number;
      salaryMax?: number;
      companyId?: string;
    },
    pagination: {
      page?: number;
      limit?: number;
      sort?: string;
    }
  ): Promise<any> {
    const searchFilters: any = {
      ...filters,
      status: "Published" // Guest and Students can only search published jobs
    };

    if (filters.skills) {
      searchFilters.skills = filters.skills.split(",").map((s) => s.trim());
    }

    const result = await this.jobRepo.findAndCount(searchFilters, pagination);
    return {
      jobs: result.jobs,
      total: result.total,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalPages: Math.ceil(result.total / (pagination.limit || 10))
    };
  }

  async getCompanyJobs(companyId: string, userId?: string): Promise<any[]> {
    let isMember = false;
    if (userId) {
      const member = await this.memberRepo.findMember(companyId, userId);
      if (member) isMember = true;
    }

    const filters: any = { companyId };
    if (!isMember) {
      // Public can only see non-draft (Published, Closed, Archived)
      filters.status = "Published"; // Let's simplify to published only or use $ne: "Draft"
    }

    const result = await this.jobRepo.findAndCount(filters, { limit: 100 });
    return result.jobs;
  }

  async getRecruiterJobs(userId: string): Promise<any[]> {
    const result = await this.jobRepo.findAndCount(
      { recruiterId: userId },
      { limit: 100 }
    );
    return result.jobs;
  }
}
