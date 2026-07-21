import { EmailQueueService } from "../queues/email.queue.js";
import { appEvents } from "../../../shared/utils/event.util.js";
import { Logger } from "../../../infrastructure/logger/logger.js";
import { env } from "../../../config/env.js";

const emailQueue = new EmailQueueService();

export class NotificationService {
  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationLink = `${env.SITE_URL}/verify-email?token=${token}`;
    await emailQueue.addEmailJob(email, "verification", { name, verificationLink });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await emailQueue.addEmailJob(email, "welcome", { name });
  }

  async sendNewApplicationNotification(recruiterEmail: string, candidateName: string, jobTitle: string): Promise<void> {
    await emailQueue.addEmailJob(recruiterEmail, "new_application", { candidateName, jobTitle });
  }

  async sendApplicationSubmittedNotification(candidateEmail: string, candidateName: string, jobTitle: string, companyName: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "application_submitted", { candidateName, jobTitle, companyName });
  }

  async sendApplicationStatusUpdate(candidateEmail: string, candidateName: string, jobTitle: string, companyName: string, status: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "application_status_updated", { candidateName, jobTitle, companyName, applicationStatus: status });
  }

  async sendJobClosedNotification(candidateEmail: string, candidateName: string, jobTitle: string, companyName: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "job_closed", { candidateName, jobTitle, companyName });
  }

  async sendInterviewScheduled(candidateEmail: string, recruiterEmail: string, candidateName: string, jobTitle: string, date: string, startTime: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "interview_scheduled", { candidateName, jobTitle, interviewDate: date, interviewTime: startTime });
    await emailQueue.addEmailJob(recruiterEmail, "interview_scheduled", { candidateName: "Recruiter", jobTitle, interviewDate: date, interviewTime: startTime });
  }

  async sendInterviewCancelled(candidateEmail: string, recruiterEmail: string, candidateName: string, jobTitle: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "interview_cancelled", { candidateName, jobTitle });
    await emailQueue.addEmailJob(recruiterEmail, "interview_cancelled", { candidateName: "Recruiter", jobTitle });
  }

  async sendInterviewCompleted(candidateEmail: string, recruiterEmail: string, candidateName: string, jobTitle: string): Promise<void> {
    await emailQueue.addEmailJob(candidateEmail, "interview_completed", { candidateName, jobTitle });
    await emailQueue.addEmailJob(recruiterEmail, "interview_completed", { candidateName: "Recruiter", jobTitle });
  }

  async sendRecruiterInvited(email: string, companyName: string, inviteLink?: string): Promise<void> {
    await emailQueue.addEmailJob(email, "recruiter_invited", { companyName, inviteLink });
  }
}

export const initNotificationListeners = () => {
  const notificationService = new NotificationService();

  appEvents.on("interview:scheduled", async (data) => {
    try {
      await notificationService.sendInterviewScheduled(
        data.candidateEmail,
        data.recruiterEmail,
        data.candidateName || "Candidate",
        data.jobTitle || "Job",
        data.date,
        data.startTime
      );
    } catch (err: any) {
      Logger.error(`[Notification Listener] Error processing interview:scheduled: ${err.message}`);
    }
  });

  appEvents.on("interview:rescheduled", async (data) => {
    try {
      await notificationService.sendInterviewScheduled(
        data.candidateEmail,
        data.recruiterEmail,
        data.candidateName || "Candidate",
        data.jobTitle || "Job",
        data.date,
        data.startTime
      );
    } catch (err: any) {
      Logger.error(`[Notification Listener] Error processing interview:rescheduled: ${err.message}`);
    }
  });

  appEvents.on("interview:cancelled", async (data) => {
    try {
      await notificationService.sendInterviewCancelled(
        data.candidateEmail,
        data.recruiterEmail,
        data.candidateName || "Candidate",
        data.jobTitle || "Job"
      );
    } catch (err: any) {
      Logger.error(`[Notification Listener] Error processing interview:cancelled: ${err.message}`);
    }
  });

  appEvents.on("interview:completed", async (data) => {
    try {
      await notificationService.sendInterviewCompleted(
        data.candidateEmail,
        data.recruiterEmail,
        data.candidateName || "Candidate",
        data.jobTitle || "Job"
      );
    } catch (err: any) {
      Logger.error(`[Notification Listener] Error processing interview:completed: ${err.message}`);
    }
  });
};
