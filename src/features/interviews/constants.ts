import type {
  ContractDetail,
  ContractRequest,
  InterviewRequest,
} from "./types";

/**
 * Copy transcribed from Figma (file YcS6lbNoziPOaqZ1QPNCSk):
 * interview tab = 11574:12992, contract signing tab = 11574:13071,
 * contract details = 11574:13150. Static until the requests API exists.
 */

export const REQUESTS_HREF = "/dashboard/requests";
export const CONTRACTS_HREF = `${REQUESTS_HREF}/contracts`;
export const contractHref = (id: string) => `${CONTRACTS_HREF}/${id}`;

export const REQUESTS_SUBTITLE =
  "Interview and contract requests from business owners.";
export const CONTRACT_DETAIL_SUBTITLE =
  "Your active marketplace engagements and project workspaces.";

export const ICONS = {
  avatar: "/images/interviews/client-avatar.svg",
  upload: "/images/interviews/upload-cloud.svg",
  file: "/images/interviews/file.svg",
  timelineDot: "/images/interviews/timeline-dot.svg",
} as const;

export const SIGNATURE_ACCEPT = ".pdf,.png,.jpg,.jpeg";
export const PROJECT_FILE_ACCEPT = ".pdf,.xlsx,.csv,.docx";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const COMING_SOON =
  "This will be available once the requests API is connected.";

/** Both Figma cards show the same placeholder request; ids keep them distinct. */
export const INTERVIEW_REQUESTS: readonly InterviewRequest[] = [
  {
    id: "verde-hospitality-ecommerce",
    company: "Verde Hospitality",
    received: "Interview request 3m ago",
    project: "E-commerce Bookkeeping Setup",
    value: "$2,400",
    deadline: "Dec 15, 2025",
  },
  {
    id: "verde-hospitality-ecommerce-2",
    company: "Verde Hospitality",
    received: "Interview request 3m ago",
    project: "E-commerce Bookkeeping Setup",
    value: "$2,400",
    deadline: "Dec 15, 2025",
  },
];

const ECOMMERCE_CONTRACT: ContractDetail = {
  title: "E-commerce Bookkeeping Setup",
  status: "In Progress",
  description:
    "Complete bookkeeping system setup for a growing e-commerce business using Shopify and QuickBooks Online, including historical data import and monthly reporting templates.",
  scope: [
    { label: "Chart of Accounts Setup", status: "complete" },
    {
      label: "Historical Transaction Import (12 months)",
      status: "in-progress",
    },
    { label: "Bank Reconciliation (3 months)", status: "pending" },
    { label: "Monthly Reporting Template", status: "pending" },
  ],
  files: [
    { id: "chart-of-accounts", name: "Chart_of_Accounts_v2.xlsx" },
    { id: "kickoff-brief", name: "Kickoff_Brief.pdf" },
    { id: "qb-import-template", name: "QuickBooks_Import_Template.csv" },
  ],
  info: [
    { label: "Client", value: "Luminary Co." },
    { label: "Value", value: "$2,400" },
    { label: "Deadline", value: "Dec 15, 2025" },
    { label: "Status", value: "In Progress" },
  ],
  timeline: [
    { date: "Nov 1", label: "Project Kickoff" },
    { date: "Nov 8", label: "Chart of Accounts delivered" },
    { date: "Nov 20", label: "Historical import complete" },
    { date: "Dec 5", label: "Reconciliation review" },
    { date: "Dec 15", label: "Final delivery" },
  ],
};

export const CONTRACT_REQUESTS: readonly ContractRequest[] = [
  {
    id: "verde-ecommerce-setup",
    company: "Verde Hospitality",
    // Figma reuses "Interview request" here; corrected for the contract tab.
    received: "Contract request 3m ago",
    project: "E-commerce Bookkeeping Setup",
    value: "$2,400",
    deadline: "Dec 15, 2025",
    detail: ECOMMERCE_CONTRACT,
  },
  {
    id: "verde-ecommerce-setup-2",
    company: "Verde Hospitality",
    received: "Contract request 3m ago",
    project: "E-commerce Bookkeeping Setup",
    value: "$2,400",
    deadline: "Dec 15, 2025",
    detail: ECOMMERCE_CONTRACT,
  },
];

export const findContract = (id: string) =>
  CONTRACT_REQUESTS.find((contract) => contract.id === id);
