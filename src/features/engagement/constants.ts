import type { Engagement, EngagementStatus } from "./types";

/**
 * Copy transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk,
 * Contracts frame = node 11572:5287). Static until the contracts endpoint exists.
 */

export const ENGAGEMENT_TITLE = "Engagement";
export const ENGAGEMENT_SUBTITLE =
  "Interview and contract requests from business owners.";
export const ENGAGEMENT_SECTION_TITLE = "Engagement";
export const ENGAGEMENT_SECTION_DESCRIPTION =
  "Manage and review all bookkeeper applications submitted on the platform.";

export const ENGAGEMENTS_PAGE_SIZE = 5;

export const SIGN_COMING_SOON = "Contract e-signing is coming soon.";

export const ENGAGEMENT_STATUS_STYLES: Record<EngagementStatus, string> = {
  Active: "w-[120px] bg-[rgba(69,132,93,0.1)] text-[#45845d]",
  Sign: "w-[120px] bg-[rgba(96,157,207,0.1)] text-[#609dcf]",
  "Pending Signature": "bg-[rgba(164,141,7,0.1)] text-[#d3b300]",
};

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    id: "CON-00124",
    bookkeeper: "Sarah Chen",
    project: "Monthly Bookkeeping",
    contractDate: "Aug 10, 2026",
    contractPeriod: "Aug 10 – Aug 17",
    contractValue: "$500",
    status: "Active",
  },
  {
    id: "CON-00123",
    bookkeeper: "James Wilson",
    project: "Tax Preparation",
    contractDate: "Aug 05, 2026",
    contractPeriod: "Aug 05 – Aug 12",
    contractValue: "$750",
    status: "Sign",
  },
  {
    id: "CON-00122",
    bookkeeper: "Emily Carter",
    project: "Payroll Support",
    contractDate: "Jul 28, 2026",
    contractPeriod: "Jul 28 – Aug 04",
    contractValue: "$400",
    status: "Pending Signature",
  },
];
