import type { Certificate } from "./types";

/**
 * Copy transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk):
 * list = node 11380:12577, viewer = node 11380:12712.
 * Static until the certificates endpoint exists.
 */

export const CERTIFICATES_HREF = "/dashboard/certificates";
export const certificateHref = (id: string) => `${CERTIFICATES_HREF}/${id}`;

export const CERTIFICATES_TITLE = "Certificates";
export const CERTIFICATES_SUBTITLE =
  "Earned certifications from completed courses.";

export const CERTIFICATE_ICONS = {
  badge: "/images/certificates/certificate-badge.svg",
  arrowBrand: "/images/certificates/arrow-brand.svg",
} as const;

export const PDF_COMING_SOON = "Certificate PDF downloads are coming soon.";

const payrollCertificate = {
  kind: "Certificate of Completion",
  course: "Payroll Management Fundamentals",
  awardedTo: "Sarah Mitchell",
  completionDate: "January 15, 2025",
  lessons: 18,
  instructor: "Tom Walsh",
  duration: "Duration: 45 min",
} satisfies Omit<Certificate, "id">;

// Figma repeats the same placeholder certificate three times.
export const CERTIFICATES: readonly Certificate[] = [
  { id: "payroll-management-fundamentals-1", ...payrollCertificate },
  { id: "payroll-management-fundamentals-2", ...payrollCertificate },
  { id: "payroll-management-fundamentals-3", ...payrollCertificate },
];

export const findCertificate = (id: string) =>
  CERTIFICATES.find((certificate) => certificate.id === id);
