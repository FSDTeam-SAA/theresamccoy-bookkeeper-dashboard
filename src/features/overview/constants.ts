/**
 * Dashboard overview content from Figma node 11380:10375.
 * Static until the bookkeeper stats endpoints exist.
 */
export const ASSESSMENT_HREF =
  "/dashboard/application/assessments/core-bookkeeping-fundamentals";

export type StatCard = { label: string; value: string; dot: string };

export const overviewStats: StatCard[] = [
  { label: "Vetting Status", value: "Profile Approved", dot: "#10b981" },
  { label: "Assessment Score", value: "82 / 100", dot: "#f59e0b" },
  { label: "Unread Messages", value: "7", dot: "#10b981" },
  { label: "Training Progress", value: "Module 3 of 5", dot: "#3b82f6" },
];

export const profileCompletion = {
  percent: 82,
  items: [
    { label: "Work experience", done: true },
    { label: "Certifications", done: true },
    { label: "Portfolio samples", done: false },
    { label: "Hourly rate set", done: true },
  ],
};

export type AssessmentProgress = {
  name: string;
  status: "In Progress" | "Not Started" | "Completed";
  progress: number; // 0–100
};

export const assessmentProgress: AssessmentProgress[] = [
  { name: "Xero Advanced", status: "In Progress", progress: 60 },
  { name: "Payroll Specialist", status: "Not Started", progress: 0 },
  { name: "QuickBooks Pro", status: "Completed", progress: 100 },
];

export const recentMessages = [
  {
    from: "Harrington & Co.",
    preview: "Can we schedule a call for..",
    time: "2h ago",
    unread: true,
  },
  {
    from: "Verde Hospitality",
    preview: "The Q2 reports look gre,..",
    time: "1d ago",
    unread: false,
  },
];

export type QuickAction = {
  title: string;
  description: string;
  icon: string;
  href?: string;
};

export const quickActions: QuickAction[] = [
  {
    title: "Complete Profile",
    description: "Add missing sections",
    icon: "/images/dashboard/overview/person.svg",
    href: "/dashboard/profile/edit",
  },
  {
    title: "Continue Assessment",
    description: "Xero Advanced — 60%",
    icon: "/images/dashboard/overview/paper.svg",
    href: ASSESSMENT_HREF,
  },
  {
    title: "View Projects",
    description: "3 active projects",
    icon: "/images/dashboard/overview/message-text.svg",
  },
];
