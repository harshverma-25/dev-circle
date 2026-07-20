import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const applySchema = z.object({
  body: z.object({
    jobId: objectIdSchema
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "Applied",
      "Under Review",
      "Interview Scheduled",
      "Interview Completed",
      "Offer",
      "Accepted",
      "Rejected"
    ] as [string, ...string[]])
  })
});
