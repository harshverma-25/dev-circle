import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobRepository } from "../../jobs/repositories/job.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { ResumeRepository } from "../../users/repositories/resume.repository.js";
import { CompanyMemberRepository } from "../../companies/repositories/company-member.repository.js";
import { CustomError, AuthorizationError } from "../../../shared/errors/custom.error.js";
import { Types } from "mongoose";

export class ApplicationService {
  private applicationRepo = new ApplicationRepository();
  private jobRepo = new JobRepository();
  private userRepo = new UserRepository();
  private resumeRepo = new ResumeRepository();
  private memberRepo = new CompanyMemberRepository();

  async apply(userId: string, jobId: string): Promise<any> {
    // Check if candidate exists and is a student
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new CustomError("Candidate user not found", 404, "USER_NOT_FOUND");
    }
    if (user.role !== "student") {
      throw new AuthorizationError("Only candidate students can apply for jobs");
    }

    // Check if job exists
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    // Reject application if job is Closed or Archived
    if (job.status === "Closed") {
      throw new CustomError("Applications are closed for this job", 400, "JOB_CLOSED");
    }
    if (job.status === "Archived") {
      throw new CustomError("Applications are closed for this job", 400, "JOB_CLOSED");
    }
    if (job.status === "Draft") {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    // Candidates can only apply once per job
    const existing = await this.applicationRepo.findByJobAndCandidate(jobId, userId);
    if (existing) {
      throw new CustomError("You have already applied for this job", 400, "APPLICATION_EXISTS");
    }

    // Retrieve candidate resume
    const resume = await this.resumeRepo.findByUserId(userId);
    if (!resume) {
      throw new CustomError("Please upload a resume first", 400, "INVALID_APPLICATION");
    }

    // Create snapshots
    const resumeSnapshot = {
      url: resume.url,
      publicId: resume.publicId,
      uploadedAt: resume.createdAt
    };

    const candidateSnapshot = {
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      headline: user.headline || "",
      skills: user.skills || [],
      education: (user.education || []).map((edu: any) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy || "",
        startYear: edu.startYear,
        endYear: edu.endYear,
        cgpa: edu.cgpa
      })),
      experience: (user.experience || []).map((exp: any) => ({
        company: exp.company,
        role: exp.role,
        employmentType: exp.employmentType || "",
        startDate: exp.startDate,
        endDate: exp.endDate,
        currentlyWorking: exp.currentlyWorking || false,
        description: exp.description || ""
      })),
      socialLinks: {
        github: user.socialLinks?.github || "",
        linkedin: user.socialLinks?.linkedin || "",
        portfolio: user.socialLinks?.portfolio || "",
        leetcode: user.socialLinks?.leetcode || "",
        codeforces: user.socialLinks?.codeforces || "",
        hackerrank: user.socialLinks?.hackerrank || ""
      }
    };

    const application = await this.applicationRepo.create({
      jobId: new Types.ObjectId(jobId),
      candidateId: new Types.ObjectId(userId),
      companyId: job.companyId._id || job.companyId,
      status: "Applied",
      resumeSnapshot,
      candidateSnapshot
    });

    return application;
  }

  async withdrawApplication(applicationId: string, userId: string): Promise<void> {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new CustomError("Application not found", 404, "APPLICATION_NOT_FOUND");
    }

    const candidateIdStr = (application.candidateId as any)._id
      ? (application.candidateId as any)._id.toString()
      : application.candidateId.toString();

    if (candidateIdStr !== userId) {
      throw new AuthorizationError("Permission denied: You can only withdraw your own applications");
    }

    await this.applicationRepo.delete(applicationId);
  }

  async updateStatus(
    applicationId: string,
    userId: string,
    status: "Applied" | "Under Review" | "Interview Scheduled" | "Interview Completed" | "Offer" | "Accepted" | "Rejected"
  ): Promise<any> {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new CustomError("Application not found", 404, "APPLICATION_NOT_FOUND");
    }

    // Only Company Owner, Admin, and Recruiter can update application status
    const member = await this.memberRepo.findMember(application.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only company recruiters can update application status");
    }

    const updated = await this.applicationRepo.updateStatus(applicationId, status);
    return updated;
  }

  async getMyApplications(userId: string): Promise<any[]> {
    return this.applicationRepo.findByCandidate(userId);
  }

  async getJobApplications(jobId: string, userId: string): Promise<any[]> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId._id || job.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: You do not have access to view applications for this job");
    }

    return this.applicationRepo.findByJob(jobId);
  }

  async getApplicationDetails(applicationId: string, userId: string): Promise<any> {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new CustomError("Application not found", 404, "APPLICATION_NOT_FOUND");
    }

    const candidateIdStr = (application.candidateId as any)._id
      ? (application.candidateId as any)._id.toString()
      : application.candidateId.toString();

    const isCandidate = candidateIdStr === userId;
    const member = await this.memberRepo.findMember(application.companyId, userId);

    if (!isCandidate && !member) {
      throw new AuthorizationError("Permission denied: You do not have permission to view this application");
    }

    return application;
  }
}
