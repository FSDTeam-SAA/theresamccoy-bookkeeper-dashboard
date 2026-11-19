import { z } from "zod";

const required = (label: string) =>
  z.string().trim().min(1, `${label} is required`).max(120);
const optionalText = (max = 120) => z.string().trim().max(max);
const mustConfirm = (message: string) =>
  z.boolean().refine((value) => value, { message });

export const personalSchema = z.object({
  firstName: required("First name"),
  lastName: required("Last name"),
  email: z.union([
    z.literal(""),
    z.email("Enter a valid email address").max(254),
  ]),
  phone: optionalText(30).refine(
    (v) => v === "" || /^[+()\d\s.-]{7,}$/.test(v),
    "Enter a valid phone number",
  ),
  city: required("City"),
  state: required("State"),
  zip: optionalText(10).refine(
    (v) => v === "" || /^[A-Za-z0-9 -]{3,10}$/.test(v),
    "Enter a valid ZIP code",
  ),
  linkedin: optionalText(300).refine(
    (v) => v === "" || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v),
    "Enter a valid URL",
  ),
});

export const experienceSchema = z.object({
  yearsExperience: optionalText(),
  credential: optionalText(),
  employer: optionalText(),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  summary: optionalText(2000),
});

export const skillsSchema = z.object({
  software: z.record(z.string(), z.string()),
  coreSkills: z.array(z.string()),
  tracks: z.array(z.string()),
});

export const assessmentSchema = z.object({
  assessmentCompleted: mustConfirm(
    "Please confirm you have completed the skills assessment",
  ),
  resumeFileName: z
    .string()
    .min(1, "Please upload your resume")
    .regex(/\.(pdf|docx?)$/i, "Upload a PDF, DOC or DOCX file"),
});

export const availabilitySchema = z.object({
  workArrangement: required("Work arrangement"),
  engagementType: required("Engagement type"),
  days: z.array(z.string()),
  hourlyRate: required("Hourly rate range"),
  retainerInterest: optionalText(),
  referralSource: optionalText(),
  referralName: optionalText(),
  notes: optionalText(2000),
  confirmAccuracy: mustConfirm("Please confirm your information is accurate"),
  confirmContact: mustConfirm("Please agree to be contacted"),
  confirmTerms: mustConfirm(
    "Please agree to the Terms of Service and Privacy Policy",
  ),
});

export type PersonalValues = z.infer<typeof personalSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type SkillsValues = z.infer<typeof skillsSchema>;
export type AssessmentValues = z.infer<typeof assessmentSchema>;
export type AvailabilityValues = z.infer<typeof availabilitySchema>;

export type ApplyDraft = {
  personal: PersonalValues;
  experience: ExperienceValues;
  skills: SkillsValues;
  assessment: AssessmentValues;
  availability: AvailabilityValues;
};

export const EMPTY_DRAFT: ApplyDraft = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    linkedin: "",
  },
  experience: {
    yearsExperience: "",
    credential: "",
    employer: "",
    industries: [],
    summary: "",
  },
  skills: { software: {}, coreSkills: [], tracks: [] },
  assessment: { assessmentCompleted: false, resumeFileName: "" },
  availability: {
    workArrangement: "",
    engagementType: "",
    days: [],
    hourlyRate: "",
    retainerInterest: "",
    referralSource: "",
    referralName: "",
    notes: "",
    confirmAccuracy: false,
    confirmContact: false,
    confirmTerms: false,
  },
};
