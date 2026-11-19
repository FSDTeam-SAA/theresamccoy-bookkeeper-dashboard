import type { Profile } from "./types";

export const PROFILE_ROUTES = {
  view: "/dashboard/profile",
  edit: "/dashboard/profile/edit",
} as const;

export const PROFILE_HEADER = {
  title: "Profile & Skills",
  subtitle: "Here's an overview of your Profile and skills.",
} as const;

const ICON_DIR = "/images/profile";

/** Figma-exported assets (downloaded into public/images/profile). */
export const PROFILE_ICONS = {
  editPen: `${ICON_DIR}/edit-pen.svg`,
  location: `${ICON_DIR}/location.svg`,
  dot: `${ICON_DIR}/dot.svg`,
  certificate: `${ICON_DIR}/certificate-check.svg`,
  divider: `${ICON_DIR}/divider.svg`,
  portfolioFile: `${ICON_DIR}/portfolio-file.svg`,
  photoEdit: `${ICON_DIR}/photo-edit.svg`,
  upload: `${ICON_DIR}/upload.svg`,
  chipClose: `${ICON_DIR}/chip-close.svg`,
  plus: `${ICON_DIR}/plus.svg`,
  pdfUpload: `${ICON_DIR}/pdf-upload.svg`,
} as const;

export const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Mock profile from the Figma design (nodes 11380:11389 / 11380:11190). */
export const DEFAULT_PROFILE: Profile = {
  headline: "Senior Bookkeeper · E-commerce Specialist",
  availableNow: true,
  photoUrl: `${ICON_DIR}/profile-photo.jpg`,
  personal: {
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    location: "Sydney, Australia",
    phone: "+61 412 345 678",
    bio: "Experienced bookkeeper with 7+ years in e-commerce and SaaS. Specialised in QuickBooks Online, Xero, and Stripe reconciliation workflows.",
  },
  skills: [
    "Inventory Reconciliation",
    "Multi-currency Accounting",
    "Shopify Revenue Reporting",
    "Bank Reconciliation",
    "Month-end Close",
    "Management Reporting",
    "Cash Flow Forecasting",
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Xero Certified Advisor",
      issuer: "Xero",
      year: "2021",
    },
    {
      id: "cert-2",
      title: "BAS Agent Registration",
      issuer: "Tax Practitioners Board",
      year: "2022",
    },
    {
      id: "cert-3",
      title: "Marketplace Elite Certification",
      issuer: "Bookkeepers Marketplace",
      year: "2023",
    },
    {
      id: "cert-4",
      title: "QuickBooks Online ProAdvisor",
      issuer: "Intuit",
      year: "2023",
    },
  ],
  portfolio: [
    {
      id: "portfolio-1",
      title: "DTC Fashion Brand — Shopify + Xero Integration",
      description:
        "Reduced monthly reconciliation time by 68% through A2X automation and custom Xero tracking categories for a $4M annual-revenue brand.",
      department: "E-commerce & Retail",
      fileName: "dtc-fashion-brand-case-study.pdf",
    },
    {
      id: "portfolio-2",
      title: "Subscription Box Start-up — Recurring Revenue Setup",
      description:
        "Designed full chart of accounts and revenue recognition schedule for a $2.4M ARR business launching simultaneously in Australia and New Zealand.",
      department: "E-commerce & Retail",
      fileName: "subscription-box-revenue-setup.pdf",
    },
    {
      id: "portfolio-3",
      title: "Multi-channel Retailer — Amazon + Shopify Consolidation",
      description:
        "Reconciled 18 months of backlogged multi-currency transactions across four platforms in six weeks, zero discrepancies on final audit.",
      department: "E-commerce & Retail",
      fileName: "multi-channel-retailer-consolidation.pdf",
    },
  ],
  other: {
    hourlyRate: 85,
    projectsDone: 63,
    experienceYears: 8,
    languages: "English · Mandarin",
    availability: "Full-time",
  },
};
