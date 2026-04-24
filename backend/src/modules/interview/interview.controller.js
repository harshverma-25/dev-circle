import { createInterview } from "./interview.service.js";

export const createInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const interview = await createInterview(req.body, userId);

    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import { getInterviews } from "./interview.service.js";

export const getInterviewsController = async (req, res) => {
  try {
    const interviews = await getInterviews();

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};