import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const salarySchema = z
  .object({
    min: z.number().int().nonnegative("Salary minimum must be non-negative").optional().nullable(),
    max: z.number().int().nonnegative("Salary maximum must be non-negative").optional().nullable(),
    currency: z.string().trim().max(10).optional().default("USD")
  })
  .optional()
  .refine(
    (val) => {
      if (val && val.min !== undefined && val.max !== undefined && val.min !== null && val.max !== null) {
        return val.min <= val.max;
      }
      return true;
    },
    { message: "Salary minimum cannot exceed maximum", path: ["min"] }
  );

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
    companyId: objectIdSchema,
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
    responsibilities: z.string().trim().max(5000).optional(),
    requirements: z.string().trim().max(5000).optional(),
    skills: z.array(z.string().trim().min(1)).min(1, "At least one skill is required"),
    location: z.string().trim().min(2, "Location must be at least 2 characters").max(200),
    workMode: z.enum(["Remote", "Hybrid", "On-site"] as [string, ...string[]]),
    jobType: z.enum(["Full Time", "Internship", "Part Time", "Contract"] as [string, ...string[]]),
    experienceLevel: z.enum(["Fresher", "0–1 Years", "1–3 Years", "3–5 Years", "5+ Years"] as [string, ...string[]]),
    salary: salarySchema,
    openings: z.number().int().min(1, "Openings must be at least 1").optional().default(1),
    applicationDeadline: z
      .string()
      .datetime({ message: "Invalid application deadline date format" })
      .optional()
      .nullable()
  })
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().min(10).max(5000).optional(),
    responsibilities: z.string().trim().max(5000).optional(),
    requirements: z.string().trim().max(5000).optional(),
    skills: z.array(z.string().trim().min(1)).min(1).optional(),
    location: z.string().trim().min(2).max(200).optional(),
    workMode: z.enum(["Remote", "Hybrid", "On-site"] as [string, ...string[]]).optional(),
    jobType: z.enum(["Full Time", "Internship", "Part Time", "Contract"] as [string, ...string[]]).optional(),
    experienceLevel: z.enum(["Fresher", "0–1 Years", "1–3 Years", "3–5 Years", "5+ Years"] as [string, ...string[]]).optional(),
    salary: salarySchema,
    openings: z.number().int().min(1).optional(),
    applicationDeadline: z.string().datetime().optional().nullable()
  })
});

export const searchJobsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    skills: z.string().optional(), // Comma-separated
    location: z.string().optional(),
    jobType: z.string().optional(),
    workMode: z.string().optional(),
    experienceLevel: z.string().optional(),
    salaryMin: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().nonnegative())
      .optional(),
    salaryMax: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().nonnegative())
      .optional(),
    page: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().int().positive())
      .optional(),
    limit: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().int().positive())
      .optional(),
    sort: z.string().optional(),
    companyId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional()
  })
});
