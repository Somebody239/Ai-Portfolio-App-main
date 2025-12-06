/**
 * Centralized validation schemas using Zod
 * Ensures consistent validation across the application
 */
import { z } from "zod";

export const UserProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  intendedMajor: z
    .string()
    .min(2, "Please enter a major")
    .max(200, "Major must be less than 200 characters"),
});

export const AcademicDataSchema = z.object({
  currentGpa: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 4.5;
      },
      "GPA must be between 0.0 and 4.5"
    ),
  satScore: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 400 && num <= 1600;
      },
      "SAT score must be between 400 and 1600"
    ),
  curriculumType: z.enum(["AP", "IB", "Both", ""]).optional(),
});

export const TargetUniversitySchema = z.object({
  dreamUniversities: z.array(z.string().uuid("Invalid university ID"))
    .min(1, "Please select at least one university")
    .max(10, "Maximum 10 universities allowed"),
});

export const OnboardingDataSchema = UserProfileSchema.merge(AcademicDataSchema).merge(TargetUniversitySchema);

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type AcademicDataInput = z.infer<typeof AcademicDataSchema>;
export type TargetUniversityInput = z.infer<typeof TargetUniversitySchema>;
export type OnboardingDataInput = z.infer<typeof OnboardingDataSchema>;

