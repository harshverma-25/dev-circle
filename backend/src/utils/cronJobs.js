import cron from "node-cron";
import Interview from "../models/interview.model.js";
import Application from "../models/application.model.js";

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
      await Interview.findByIdAndDelete(interview._id);
    }

    if (expiredInterviews.length > 0) {
      console.log(`Deleted ${expiredInterviews.length} expired interviews`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
};

// run every 10 minutes
cron.schedule("*/10 * * * *", deleteExpiredInterviews);

export default deleteExpiredInterviews;