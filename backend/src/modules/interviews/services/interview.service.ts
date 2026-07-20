import { InterviewRepository } from "../repositories/interview.repository.js";
import { ApplicationRepository } from "../../applications/repositories/application.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { CompanyMemberRepository } from "../../companies/repositories/company-member.repository.js";
import { CustomError, AuthorizationError } from "../../../shared/errors/custom.error.js";
import { appEvents } from "../../../shared/utils/event.util.js";
import { Types } from "mongoose";

const parseTimeToMinutes = (timeStr: string): number => {
  const match12 = timeStr.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  }

  const match24 = timeStr.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }
  return -1;
};

export class InterviewService {
  private interviewRepo = new InterviewRepository();
  private applicationRepo = new ApplicationRepository();
  private userRepo = new UserRepository();
  private memberRepo = new CompanyMemberRepository();

  async scheduleInterview(userId: string, data: any): Promise<any> {
    const { applicationId, meetingType, meetingLink, date, startTime, endTime, timezone, notes } = data;

    // Retrieve application
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new CustomError("Application not found", 404, "APPLICATION_NOT_FOUND");
    }

    // Check recruiter permission (must belong to the posting company)
    const member = await this.memberRepo.findMember(application.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only company recruiters can schedule interviews");
    }

    // One interview per application
    const existing = await this.interviewRepo.findByApplicationId(applicationId);
    if (existing) {
      throw new CustomError("An interview has already been scheduled for this application", 400, "INTERVIEW_EXISTS");
    }

    // Interview only after "Under Review"
    if (application.status === "Applied") {
      throw new CustomError("Application must be moved to Under Review status before scheduling an interview", 400, "INVALID_TIME");
    }

    // Validate date (must be in the future)
    const interviewDate = new Date(date);
    if (interviewDate.getTime() <= Date.now()) {
      throw new CustomError("Interview date must be in the future", 400, "INVALID_TIME");
    }

    // Validate times
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);
    if (startMins === -1 || endMins === -1 || startMins >= endMins) {
      throw new CustomError("Interview start time must be before the end time", 400, "INVALID_TIME");
    }

    // Create interview record
    const interview = await this.interviewRepo.create({
      applicationId: application._id,
      jobId: application.jobId._id || application.jobId,
      companyId: application.companyId,
      candidateId: application.candidateId._id || application.candidateId,
      recruiterId: new Types.ObjectId(userId),
      meetingType,
      meetingLink: meetingLink || "",
      date: interviewDate,
      startTime,
      endTime,
      timezone,
      notes: notes || "",
      status: "Scheduled"
    });

    // Update application status to Interview Scheduled
    await this.applicationRepo.updateStatus(application._id, "Interview Scheduled");

    // Fetch actor details to send notifications
    const candidate = await this.userRepo.findById(application.candidateId._id || application.candidateId);
    const recruiter = await this.userRepo.findById(userId);

    appEvents.emit("interview:scheduled", {
      interviewId: interview._id,
      candidateEmail: candidate?.email,
      recruiterEmail: recruiter?.email,
      date,
      startTime
    });

    return interview;
  }

  async rescheduleInterview(interviewId: string, userId: string, data: any): Promise<any> {
    const interview = await this.interviewRepo.findById(interviewId);
    if (!interview) {
      throw new CustomError("Interview not found", 404, "INTERVIEW_NOT_FOUND");
    }

    // Check recruiter permission
    const member = await this.memberRepo.findMember(interview.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only company recruiters can reschedule interviews");
    }

    // Cannot reschedule completed or cancelled interviews
    if (interview.status === "Completed") {
      throw new CustomError("Cannot reschedule a completed interview", 400, "INTERVIEW_COMPLETED");
    }
    if (interview.status === "Cancelled") {
      throw new CustomError("Cannot reschedule a cancelled interview", 400, "INTERVIEW_CANCELLED");
    }

    // Validate new date if provided
    const newDateStr = data.date || interview.date.toISOString();
    const newDate = new Date(newDateStr);
    if (newDate.getTime() <= Date.now()) {
      throw new CustomError("Rescheduled interview date must be in the future", 400, "INVALID_TIME");
    }

    // Validate new times if provided
    const newStart = data.startTime || interview.startTime;
    const newEnd = data.endTime || interview.endTime;
    const startMins = parseTimeToMinutes(newStart);
    const endMins = parseTimeToMinutes(newEnd);
    if (startMins === -1 || endMins === -1 || startMins >= endMins) {
      throw new CustomError("Interview start time must be before the end time", 400, "INVALID_TIME");
    }

    const updated = await this.interviewRepo.update(interviewId, {
      ...data,
      date: newDate
    });

    const candidate = await this.userRepo.findById(interview.candidateId._id || interview.candidateId);
    const recruiter = await this.userRepo.findById(interview.recruiterId._id || interview.recruiterId);

    appEvents.emit("interview:rescheduled", {
      interviewId,
      candidateEmail: candidate?.email,
      recruiterEmail: recruiter?.email,
      date: newDateStr,
      startTime: newStart
    });

    return updated;
  }

  async cancelInterview(interviewId: string, userId: string): Promise<any> {
    const interview = await this.interviewRepo.findById(interviewId);
    if (!interview) {
      throw new CustomError("Interview not found", 404, "INTERVIEW_NOT_FOUND");
    }

    // Only recruiter can cancel (Candidate cannot cancel in V1)
    const member = await this.memberRepo.findMember(interview.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only recruiters can cancel interviews");
    }

    if (interview.status === "Completed") {
      throw new CustomError("Cannot cancel a completed interview", 400, "INTERVIEW_COMPLETED");
    }

    const updated = await this.interviewRepo.update(interviewId, { status: "Cancelled" });

    // Update application status back to Under Review
    await this.applicationRepo.updateStatus(interview.applicationId._id || interview.applicationId, "Under Review");

    const candidate = await this.userRepo.findById(interview.candidateId._id || interview.candidateId);
    const recruiter = await this.userRepo.findById(interview.recruiterId._id || interview.recruiterId);

    appEvents.emit("interview:cancelled", {
      interviewId,
      candidateEmail: candidate?.email,
      recruiterEmail: recruiter?.email
    });

    return updated;
  }

  async completeInterview(interviewId: string, userId: string): Promise<any> {
    const interview = await this.interviewRepo.findById(interviewId);
    if (!interview) {
      throw new CustomError("Interview not found", 404, "INTERVIEW_NOT_FOUND");
    }

    // Only recruiter can complete
    const member = await this.memberRepo.findMember(interview.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only recruiters can complete interviews");
    }

    if (interview.status === "Cancelled") {
      throw new CustomError("Cannot complete a cancelled interview", 400, "INTERVIEW_CANCELLED");
    }

    const updated = await this.interviewRepo.update(interviewId, { status: "Completed" });

    // Update application status to Interview Completed
    await this.applicationRepo.updateStatus(interview.applicationId._id || interview.applicationId, "Interview Completed");

    const candidate = await this.userRepo.findById(interview.candidateId._id || interview.candidateId);
    const recruiter = await this.userRepo.findById(interview.recruiterId._id || interview.recruiterId);

    appEvents.emit("interview:completed", {
      interviewId,
      candidateEmail: candidate?.email,
      recruiterEmail: recruiter?.email
    });

    return updated;
  }

  async getInterviewDetails(interviewId: string, userId: string): Promise<any> {
    const interview = await this.interviewRepo.findById(interviewId);
    if (!interview) {
      throw new CustomError("Interview not found", 404, "INTERVIEW_NOT_FOUND");
    }

    const candidateIdStr = (interview.candidateId as any)._id
      ? (interview.candidateId as any)._id.toString()
      : interview.candidateId.toString();

    const isCandidate = candidateIdStr === userId;
    const member = await this.memberRepo.findMember(interview.companyId, userId);

    if (!isCandidate && !member) {
      throw new AuthorizationError("Permission denied: You do not have permission to view this interview");
    }

    return interview;
  }

  async getCandidateInterviews(userId: string): Promise<any[]> {
    return this.interviewRepo.findByCandidate(userId);
  }

  async getRecruiterInterviews(userId: string): Promise<any[]> {
    return this.interviewRepo.findByRecruiter(userId);
  }
}
