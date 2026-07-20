import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const scheduleInterviewSchema = z.object({
  body: z.object({
    applicationId: objectIdSchema,
    meetingType: z.enum(["Google Meet", "Zoom", "Microsoft Teams", "Other"] as [string, ...string[]]),
    meetingLink: z.string().trim().optional(),
    date: z.string().datetime({ message: "Invalid date format, must be an ISO-8601 string" }),
    startTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time format"),
    endTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time format"),
    timezone: z.string().trim().min(1, "Timezone is required"),
    notes: z.string().trim().optional()
  })
});

export const rescheduleInterviewSchema = z.object({
  body: z.object({
    meetingType: z.enum(["Google Meet", "Zoom", "Microsoft Teams", "Other"] as [string, ...string[]]).optional(),
    meetingLink: z.string().trim().optional(),
    date: z.string().datetime().optional(),
    startTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    timezone: z.string().trim().optional(),
    notes: z.string().trim().optional()
  })
});
