import cron from "node-cron";
import Interview from "../models/interview.model.js";
import Application from "../models/application.model.js";
import Participant from "../models/participant.model.js";
import cloudinary from "../config/cloudinary.js";


// NOTE: Lifecycle logic moved to API/service layer due to unreliable cron environment (sleeping servers).
// Cron is now only used for peripheral cleanup tasks.


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

// Every minute — mark inactive participants
cron.schedule("*/1 * * * *", markInactiveParticipants);

// Every day at midnight — delete old Cloudinary resume files
cron.schedule("0 0 * * *", deleteOldResumeFiles);

export default {
    markInactiveParticipants,
    deleteOldResumeFiles
};