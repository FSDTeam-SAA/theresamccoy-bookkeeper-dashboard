import { z } from "zod";

const required = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

export const personalInfoSchema = z.object({
  fullName: required("Full name", 80).min(2, "Full name is too short"),
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  location: required("Location", 120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number"),
  bio: required("Professional bio", 1000),
});
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const skillSchema = required("Skill", 50);

const currentYear = new Date().getFullYear();

export const certificationsSchema = z.object({
  certificates: z.array(
    z.object({
      id: z.string(),
      issuer: z.string().optional(),
      title: required("Title"),
      year: z
        .string()
        .trim()
        .regex(/^\d{4}$/, "Enter a 4-digit year")
        .refine(
          (v) => Number(v) >= 1950 && Number(v) <= currentYear,
          `Year must be between 1950 and ${currentYear}`,
        ),
    }),
  ),
});
export type CertificationsValues = z.infer<typeof certificationsSchema>;

export const portfolioSchema = z.object({
  portfolio: z.array(
    z.object({
      id: z.string(),
      title: required("Title", 150),
      description: required("Sub-title", 500),
      department: required("Department", 60),
      fileName: z.string().optional(),
    }),
  ),
});
export type PortfolioValues = z.infer<typeof portfolioSchema>;

const wholeNumber = (label: string, max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, `${label} must be a whole number`)
    .refine((v) => Number(v) <= max, `${label} must be ${max} or less`);

export const otherDetailsSchema = z.object({
  hourlyRate: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter an hourly rate, e.g. 85")
    .refine((v) => Number(v) > 0 && Number(v) <= 10000, "Enter a valid rate"),
  projectsDone: wholeNumber("Projects done", 100000),
  experienceYears: wholeNumber("Experience", 70),
  languages: required("Language proficiency", 120),
  availability: required("Availability", 60),
});
export type OtherDetailsValues = z.infer<typeof otherDetailsSchema>;
