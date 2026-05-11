import { analyzeResumeContent, extractTextFromPdfBuffer } from "./ats.service.js";
import User from "../../models/user.model.js";

// Check if a date is today
const isToday = (someDate) => {
  if (!someDate) return false;
  const today = new Date();
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear();
}

export const analyzeResume = async (req, res) => {
  try {
    // 1. Verify Authentication
    const userId = req.user.userId; // Matches req.user.userId from auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Check Daily Limit
    const limit = 5;
    if (isToday(user.lastAtsUsageTimestamp)) {
      if (user.atsUsageCount >= limit) {
        return res.status(429).json({
          success: false,
          message: "You have reached today's ATS analysis limit."
        });
      }
    }

    // 3. Validate File Upload
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a valid PDF resume file" });
    }

    // 4. Extract Text
    const text = await extractTextFromPdfBuffer(req.file.buffer);
    
    if (!text || text.trim() === "") {
        return res.status(400).json({ success: false, message: "Could not extract text from the PDF. Ensure it's not an image-based PDF."});
    }

    // 5. Analyze with AI (OpenRouter)
    const analysis = await analyzeResumeContent(text);

    // 6. Update user usage stats
    if (isToday(user.lastAtsUsageTimestamp)) {
      user.atsUsageCount += 1;
    } else {
      user.atsUsageCount = 1;
      user.lastAtsUsageTimestamp = new Date();
    }
    await user.save();

    // 7. Return Results
    return res.status(200).json({
      success: true,
      data: analysis,
      usage: {
        count: user.atsUsageCount,
        limit,
        remaining: limit - user.atsUsageCount
      }
    });

  } catch (error) {
    console.error("ATS Analysis Controller Error:", error);
    return res.status(500).json({ success: false, message: error.message || "An error occurred during resume analysis" });
  }
};
