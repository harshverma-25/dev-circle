import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL"
  })
  .optional();

const currentYear = new Date().getFullYear();

export const createCompanySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters"),
    industry: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    foundedYear: z
      .number()
      .int()
      .min(1700, "Founded year must be valid")
      .max(currentYear, `Founded year cannot exceed ${currentYear}`)
      .optional()
      .nullable(),
    website: optionalUrlSchema,
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
    location: z
      .object({
        country: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
        city: z.string().trim().max(100).optional()
      })
      .optional()
  })
});

export const updateCompanySchema = z.object({
  body: z.object({
    industry: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    foundedYear: z
      .number()
      .int()
      .min(1700, "Founded year must be valid")
      .max(currentYear, `Founded year cannot exceed ${currentYear}`)
      .optional()
      .nullable(),
    website: optionalUrlSchema,
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
    location: z
      .object({
        country: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
        city: z.string().trim().max(100).optional()
      })
      .optional(),
    socialLinks: z
      .object({
        linkedin: optionalUrlSchema,
        twitter: optionalUrlSchema,
        github: optionalUrlSchema
      })
      .optional()
  })
});

export const inviteRecruiterSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address"),
    role: z.enum(["Admin", "Recruiter"] as [string, ...string[]])
  })
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["Admin", "Recruiter"] as [string, ...string[]])
  })
});





