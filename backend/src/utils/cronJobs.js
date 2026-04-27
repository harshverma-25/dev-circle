import cron from "node-cron";
import Interview from "../models/interview.model.js";
import Application from "../models/application.model.js";
import Participant from "../models/participant.model.js";
import cloudinary from "../config/cloudinary.js";


// ─── Delete Expired Interviews ────────────────────────────────────────────────
// Removes interviews that were never started and are 6+ hours past their scheduledAt

const deleteExpiredInterviews = async () => {
  try {
    const now = new Date();

    const expiredInterviews = await Interview.find({
      isStarted: false,
      scheduledAt: { $lt: new Date(now.getTime() - 6 * 60 * 60 * 1000) }
    });

    for (const interview of expiredInterviews) {
      await Application.deleteMany({ interviewId: interview._id });
      await Participant.deleteMany({ interviewId: interview._id });
      await Interview.findByIdAndDelete(interview._id);
    }

    if (expiredInterviews.length > 0) {
      console.log(`[Cron] Deleted ${expiredInterviews.length} expired interviews`);
    }
  } catch (error) {
    console.error("[Cron] deleteExpiredInterviews error:", error);
  }
};


// ─── Mark Inactive Participants ───────────────────────────────────────────────
// Marks participants that haven't sent a heartbeat in the last 60 seconds as inactive

const markInactiveParticipants = async () => {
  try {
    const threshold = new Date(Date.now() - 60 * 1000);

    await Participant.updateMany(
      { lastSeen: { $lt: threshold } },
      { isActive: false }
    );
  } catch (error) {
    console.error("[Cron] markInactiveParticipants error:", error);
  }
};


// ─── Delete Old Cloudinary Resume Files ──────────────────────────────────────
// Runs daily at midnight.
// Finds applications where a file was uploaded to Cloudinary > 2 days ago
// and deletes both the cloud file and the stored reference.

const deleteOldResumeFiles = async () => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const staleApplications = await Application.find({
      resumeType: "file",
      cloudinaryPublicId: { $ne: null },
      createdAt: { $lt: twoDaysAgo }
    });

    let deleted = 0;

    for (const app of staleApplications) {
      try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(app.cloudinaryPublicId, {
          resource_type: "auto"
        });
      } catch (cloudErr) {
        // Log but don't abort — still clear the DB reference
        console.warn(`[Cron] Cloudinary delete failed for ${app.cloudinaryPublicId}:`, cloudErr.message);
      }

      // Clear stored references regardless of cloud deletion result
      app.cloudinaryPublicId = null;
      app.resumeUrl          = null;
      await app.save();
      deleted++;
    }

    if (deleted > 0) {
      console.log(`[Cron] Deleted ${deleted} expired resume files from Cloudinary`);
    }
  } catch (error) {
    console.error("[Cron] deleteOldResumeFiles error:", error);
  }
};


// ─── Schedule Jobs ────────────────────────────────────────────────────────────

// Every 10 minutes — clean up expired interviews
cron.schedule("*/10 * * * *", deleteExpiredInterviews);

// Every minute — mark inactive participants
cron.schedule("*/1 * * * *", markInactiveParticipants);

// Every day at midnight — delete old Cloudinary resume files
cron.schedule("0 0 * * *", deleteOldResumeFiles);

export default deleteExpiredInterviews;