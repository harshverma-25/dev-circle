import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const skillGapSchema = z.object({
  body: z.object({
    jobId: objectIdSchema.optional(),
    jobDescription: z.string().trim().optional()
  }).refine((data) => data.jobId || data.jobDescription, {
    message: "Either jobId or jobDescription must be provided"
  })
});

export const candidateRankingSchema = z.object({
  body: z.object({
    jobId: objectIdSchema
  })
});

export const interviewQuestionsSchema = z.object({
  body: z.object({
    jobId: objectIdSchema,
    candidateId: objectIdSchema
  })
});

export const jobDescriptionGenSchema = z.object({
  body: z.object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    experience: z.union([z.string(), z.number()]),
    skills: z.array(z.string()).min(1, "At least one skill is required")
  })
});

export const careerCoachSchema = z.object({
  body: z.object({
    goal: z.string().trim().min(1, "Goal is required")
  })
});
