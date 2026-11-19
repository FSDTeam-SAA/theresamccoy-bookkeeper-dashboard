import { z } from "zod";
import {
  MAX_EXPERIENCE_YEARS,
  MAX_FILE_BYTES,
  MIN_CERTIFICATION_YEAR,
  RESUME_EXTENSIONS,
} from "./constants";

const extensionOf = (name: string) =>
  name.split(".").pop()?.toLowerCase() ?? "";

const fileField = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
);

const withinSize = (file: File) => file.size <= MAX_FILE_BYTES;

const certificationSchema = z
  .object({
    title: z.string(),
    year: z.string(),
    document: fileField
      .refine((f) => extensionOf(f.name) === "pdf", "Upload a PDF file")
      .refine(withinSize, "PDF must be 5 MB or smaller")
      .optional(),
  })
  .superRefine((row, ctx) => {
    const title = row.title.trim();
    const year = row.year.trim();
    if (!title) {
      if (year || row.document) {
        ctx.addIssue({
          code: "custom",
          path: ["title"],
          message: "Add the certification title",
        });
      }
      return;
    }
    const current = new Date().getFullYear();
    const numeric = Number(year);
    if (
      !/^\d{4}$/.test(year) ||
      numeric < MIN_CERTIFICATION_YEAR ||
      numeric > current
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["year"],
        message: `Enter a year between ${MIN_CERTIFICATION_YEAR} and ${current}`,
      });
    }
  });

export const applicationSchema = z.object({
  experience: z
    .string()
    .trim()
    .min(1, "Enter your experience in years")
    .refine((value) => {
      if (!/^\d+(\.\d+)?$/.test(value)) return false;
      const n = Number(value);
      return n >= 0 && n <= MAX_EXPERIENCE_YEARS;
    }, `Enter a number between 0 and ${MAX_EXPERIENCE_YEARS}`),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  specializations: z
    .array(z.string())
    .min(1, "Add at least one specialization"),
  qualification: z
    .string()
    .trim()
    .min(1, "Enter your last educational qualification"),
  resume: fileField
    .optional()
    .refine((f): f is File => f !== undefined, "Upload your resume")
    .refine(
      (f) => !f || RESUME_EXTENSIONS.includes(extensionOf(f.name)),
      "Resume must be a PDF, DOC or DOCX file",
    )
    .refine((f) => !f || withinSize(f), "Resume must be 5 MB or smaller"),
  coverLetter: fileField
    .refine(withinSize, "Cover letter must be 5 MB or smaller")
    .optional(),
  certifications: z.array(certificationSchema),
});

export type ApplicationFormInput = z.input<typeof applicationSchema>;
export type ApplicationFormValues = z.output<typeof applicationSchema>;
