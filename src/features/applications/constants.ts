import type { ApplicationStatus } from "@/store/applications.store";

export const APPLICATIONS_ROUTE = "/dashboard/application/submissions";
export const NEW_APPLICATION_ROUTE = "/dashboard/application/submissions/new";
export const COURSE_ROUTE = "/dashboard/application";

export const PAGE_SIZE = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MIN_CERTIFICATION_YEAR = 1950;
export const MAX_EXPERIENCE_YEARS = 60;

export const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
export const PDF_ACCEPT = ".pdf,application/pdf";

export const ICONS = {
  uploadLight: "/images/applications/upload-light.svg",
  uploadBrand: "/images/applications/upload-brand.svg",
  uploadMuted: "/images/applications/upload-muted.svg",
  chipRemove: "/images/applications/chip-remove.svg",
  plus: "/images/applications/plus.svg",
  search: "/images/applications/search.svg",
  chevronDown: "/images/applications/chevron-down.svg",
  chevronLeft: "/images/applications/chevron-left.svg",
  chevronLeftActive: "/images/applications/chevron-left-active.svg",
} as const;

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

/** Figma status pill colours (text / 5–10% tinted background). */
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  "Under Review": "bg-[rgba(164,141,7,0.1)] text-[#d3b300]",
  Approved: "bg-[rgba(69,132,93,0.06)] text-[#45845d]",
  Submitted: "bg-[rgba(96,157,207,0.1)] text-[#609dcf]",
  Rejected: "bg-[rgba(194,65,12,0.05)] text-alert",
};

/** Example values from the design, used as input placeholders only. */
export const CERTIFICATION_PLACEHOLDERS = [
  { title: "Xero Certified Advisor", year: "2021" },
  { title: "BAS Agent Registration", year: "2022" },
];

export const RESUME_PREVIEW_UNAVAILABLE =
  "Resume preview available once uploaded to the server";
