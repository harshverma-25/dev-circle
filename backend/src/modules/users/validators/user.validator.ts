import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL"
  })
  .optional();

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),
    headline: z
      .string()
      .max(100, "Headline cannot exceed 100 characters")
      .optional(),
    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9\s-]{8,20}$/, "Invalid phone number format")
      .or(z.literal(""))
      .optional(),
    location: z
      .string()
      .max(100, "Location cannot exceed 100 characters")
      .optional()
  })
});

export const updateSkillsSchema = z.object({
  body: z.object({
    skills: z
      .array(
        z
          .string()
          .min(1, "Skill cannot be empty")
          .max(50, "Skill name cannot exceed 50 characters")
      )
      .max(30, "Maximum 30 skills allowed")
      .refine((items) => new Set(items).size === items.length, {
        message: "Skills must not contain duplicates"
      })
  })
});

export const educationItemSchema = z
  .object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().optional(),
    startYear: z.number().int().min(1900).max(2100),
    endYear: z.number().int().min(1900).max(2100).optional(),
    cgpa: z.number().min(0).max(10).optional()
  })
  .refine((data) => !data.endYear || data.startYear <= data.endYear, {
    message: "Start year must be less than or equal to end year",
    path: ["endYear"]
  });

export const updateEducationSchema = z.object({
  body: z.object({
    education: z.array(educationItemSchema)
  })
});

export const experienceItemSchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    employmentType: z.string().optional(),
    startDate: z.preprocess((arg) => {
      if (typeof arg === "string" && arg !== "") return new Date(arg);
      return arg;
    }, z.date({ message: "Start date is required" })),
    endDate: z.preprocess((arg) => {
      if (typeof arg === "string" && arg !== "") return new Date(arg);
      return arg;
    }, z.date().optional()),
    currentlyWorking: z.boolean().default(false),
    description: z.string().optional()
  })
  .refine((data) => data.currentlyWorking || !!data.endDate, {
    message: "End date is required if you are not currently working here",
    path: ["endDate"]
  });

export const updateExperienceSchema = z.object({
  body: z.object({
    experience: z.array(experienceItemSchema)
  })
});

export const updateSocialLinksSchema = z.object({
  body: z.object({
    github: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    portfolio: optionalUrlSchema,
    leetcode: optionalUrlSchema,
    codeforces: optionalUrlSchema,
    hackerrank: optionalUrlSchema
  })
});
