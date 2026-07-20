import mongoose from "mongoose";
import { NotificationService } from "../services/notification.service.js";
import { Logger } from "../../../infrastructure/logger/logger.js";

export const registerMongooseHooks = () => {
  const notificationService = new NotificationService();

  // 1. User Post-Save (e.g. Google Signups who are verified on save)
  mongoose.model("User").schema.post("save", async function (doc: any) {
    try {
      if (doc.isVerified) {
        await notificationService.sendWelcomeEmail(doc.email, doc.name);
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] User post-save error: ${err.message}`);
    }
  });

  // 2. User Post-Update (e.g. Local Signups when they verify their email)
  mongoose.model("User").schema.post("findOneAndUpdate", async function (this: any, res: any) {
    try {
      if (!res) return;
      const update = this.getUpdate();
      const isVerified = update?.isVerified || update?.$set?.isVerified;

      if (isVerified === true) {
        await notificationService.sendWelcomeEmail(res.email, res.name);
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] User post-findOneAndUpdate error: ${err.message}`);
    }
  });

  // 3. Application Post-Save (New Submission)
  mongoose.model("Application").schema.post("save", async function (doc: any) {
    try {
      const candidate = await mongoose.model("User").findById(doc.candidateId);
      if (!candidate) return;

      const job = await mongoose.model("Job").findById(doc.jobId).populate("companyId");
      if (!job) return;

      const jobTitle = job.title;
      const companyName = (job.companyId as any).name || "the company";
      const companyId = (job.companyId as any)._id || job.companyId;

      // Acknowledge submission to Candidate
      await notificationService.sendApplicationSubmittedNotification(
        candidate.email,
        candidate.name,
        jobTitle,
        companyName
      );

      // Alert company recruiters
      const members = await mongoose.model("CompanyMember")
        .find({ companyId, role: { $in: ["owner", "admin", "recruiter"] } })
        .populate("userId");

      for (const member of members) {
        const recruiterUser = member.userId as any;
        if (recruiterUser && recruiterUser.email) {
          await notificationService.sendNewApplicationNotification(
            recruiterUser.email,
            candidate.name,
            jobTitle
          );
        }
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] Application post-save error: ${err.message}`);
    }
  });

  // 4. Application Post-Update (Status Update)
  mongoose.model("Application").schema.post("findOneAndUpdate", async function (this: any, res: any) {
    try {
      if (!res) return;
      const update = this.getUpdate();
      const status = update?.status || update?.$set?.status;

      if (status) {
        const candidate = await mongoose.model("User").findById(res.candidateId);
        const job = await mongoose.model("Job").findById(res.jobId).populate("companyId");
        if (candidate && job) {
          const companyName = (job.companyId as any).name || "the company";
          await notificationService.sendApplicationStatusUpdate(
            candidate.email,
            candidate.name,
            job.title,
            companyName,
            status
          );
        }
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] Application post-findOneAndUpdate error: ${err.message}`);
    }
  });

  // 5. Job Post-Update (Job Closed/Archived)
  mongoose.model("Job").schema.post("findOneAndUpdate", async function (this: any, res: any) {
    try {
      if (!res) return;
      const update = this.getUpdate();
      const status = update?.status || update?.$set?.status;

      if (status === "Closed" || status === "Archived") {
        const job = await mongoose.model("Job").findById(res._id).populate("companyId");
        if (!job) return;

        const companyName = (job.companyId as any).name || "the company";
        const applications = await mongoose.model("Application").find({ jobId: res._id });

        for (const app of applications) {
          const candidate = await mongoose.model("User").findById(app.candidateId);
          if (candidate) {
            await notificationService.sendJobClosedNotification(
              candidate.email,
              candidate.name,
              job.title,
              companyName
            );
          }
        }
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] Job post-findOneAndUpdate error: ${err.message}`);
    }
  });

  // 6. CompanyMember Post-Save (Recruiter Invited)
  mongoose.model("CompanyMember").schema.post("save", async function (doc: any) {
    try {
      const company = await mongoose.model("Company").findById(doc.companyId);
      const user = await mongoose.model("User").findById(doc.userId);

      if (company && user && (doc.role === "recruiter" || doc.role === "admin")) {
        await notificationService.sendRecruiterInvited(
          user.email,
          company.name
        );
      }
    } catch (err: any) {
      Logger.error(`[Mongoose Hook] CompanyMember post-save error: ${err.message}`);
    }
  });
};
