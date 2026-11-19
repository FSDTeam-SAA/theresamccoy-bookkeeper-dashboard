/**
 * Option lists for the /apply onboarding wizard.
 * Checkbox groups are copied verbatim from Figma. The Figma selects only show
 * "Please Select", so their option lists are product assumptions.
 */

export const APPLY_STEPS = [
  { key: "personal", label: "Personal info" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "assessment", label: "Assessment" },
  { key: "availability", label: "Availability" },
] as const;

export type ApplyStepKey = (typeof APPLY_STEPS)[number]["key"];

export const ASSESSMENT_HREF =
  "/dashboard/application/assessments/core-bookkeeping-fundamentals";
export const SUBMISSIONS_HREF = "/dashboard/application/submissions";

export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

// Figma: "Which industries do you have experience bookkeeping for?"
export const INDUSTRIES = [
  "Construction & contracting",
  "Restaurant & food service",
  "Real estate & property mgmt",
  "Nonprofit organizations",
  "Transportation & logistics",
  "Government contracting",
  "Retail & e-commerce",
  "Healthcare & medical",
  "Professional services",
  "Technology & SaaS",
  "Beauty & wellness",
  "Other / General",
] as const;

// Figma: "Software proficiency" rows
export const SOFTWARE = [
  "QuickBooks Online",
  "QuickBooks Desktop",
  "Xero",
  "FreshBooks",
  "Wave Accounting",
  "Microsoft Excel / Google Sheets",
  "Bill.com / Melio (A/P automation)",
  "Gusto / ADP (Payroll)",
  "AI tools (Intuit Assist, Vic.ai, etc.)",
] as const;

// Figma: "Core bookkeeping skills"
export const CORE_SKILLS = [
  "Accounts receivable (A/R)",
  "Job costing",
  "Payroll processing",
  "Financial reporting",
  "Sales tax compliance",
  "Catch-up / cleanup bookkeeping",
  "E-commerce reconciliation",
  "Bank reconciliation",
  "Accounts payable (A/P)",
  "Inventory management",
  "1099 / contractor management",
  "Cash flow forecasting",
  "Multi-entity bookkeeping",
  "AI-assisted bookkeeping",
] as const;

// Figma: "Optional: specialty tracks interest"
export const SPECIALTY_TRACKS = [
  "A/R specialist track: Advanced collections & aging",
  "A/P specialist track: Vendor management & automation",
  "Financial reporting track: Statement prep & analysis",
  "AI tools",
  "Bank rec advanced track: Complex multi-account rec",
  "All tracks (max badges): Complete full certification path",
] as const;

// Figma: "Availability days"
export const AVAILABILITY_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Flexible",
] as const;

// Figma: the three confirmations above "Submit my application"
export const CONFIRMATIONS = {
  confirmAccuracy:
    "I confirm that all information provided in this application is accurate and truthful. I understand that misrepresentation may result in removal from the platform.",
  confirmContact:
    "I agree to be contacted by The Bookkeepers Marketplace / McCoy Capital Partners regarding my application and potential client matches.",
  confirmTerms:
    "I have read and agree to the Terms of Service and Privacy Policy.",
} as const;

/* ---- Assumed select options (Figma shows only "Please Select") ---- */

export const YEARS_OF_EXPERIENCE = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
] as const;

export const CREDENTIALS = [
  "None",
  "Certified Bookkeeper (AIPB)",
  "QuickBooks ProAdvisor",
  "Xero Advisor",
  "Enrolled Agent",
  "CPA",
] as const;

export const PROFICIENCY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Not used",
] as const;

export const WORK_ARRANGEMENTS = ["Remote", "Hybrid", "On-site"] as const;

export const ENGAGEMENT_TYPES = [
  "Hourly",
  "Project-based",
  "Monthly retainer",
  "Part-time",
  "Full-time",
] as const;

export const HOURLY_RATES = [
  "$25–$40",
  "$40–$60",
  "$60–$80",
  "$80–$100",
  "$100+",
] as const;

export const RETAINER_INTEREST = ["Yes", "No", "Maybe"] as const;

export const REFERRAL_SOURCES = [
  "Search engine",
  "Social media",
  "Referral",
  "Event",
  "Other",
] as const;
