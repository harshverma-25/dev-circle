import cron from "node-cron";
import Interview from "../models/interview.model.js";
import Application from "../models/application.model.js";
import Participant from "../models/participant.model.js";

const deleteExpiredInterviews = async () => {
  try {
    const now = new Date();

    const expiredInterviews = await Interview.find({
      isStarted: false,
      scheduledAt: {
        $lt: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      }
    });

    for (const interview of expiredInterviews) {
      await Application.deleteMany({ interviewId: interview._id });
      await Participant.deleteMany({ interviewId: interview._id });
      await Interview.findByIdAndDelete(interview._id);
    }

    if (expiredInterviews.length > 0) {
      console.log(`Deleted ${expiredInterviews.length} expired interviews`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
};

const markInactiveParticipants = async () => {
  const threshold = new Date(Date.now() - 60 * 1000); // 1 min

  await Participant.updateMany(
    {
      lastSeen: { $lt: threshold }
    },
    {
      isActive: false
    }
  );
};

// run every 10 minutes
cron.schedule("*/10 * * * *", deleteExpiredInterviews);
cron.schedule("*/1 * * * *", markInactiveParticipants);

export default deleteExpiredInterviews;