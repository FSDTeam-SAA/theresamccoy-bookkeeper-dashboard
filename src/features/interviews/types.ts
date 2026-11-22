export type DetailRow = { label: string; value: string };

/** Fields shared by interview and contract request cards. */
export type BusinessRequest = {
  id: string;
  company: string;
  received: string;
  project: string;
  value: string;
  deadline: string;
};

export type InterviewRequest = BusinessRequest;

export type ScopeStatus = "complete" | "in-progress" | "pending";

export type ContractDetail = {
  title: string;
  status: string;
  description: string;
  scope: { label: string; status: ScopeStatus }[];
  files: { id: string; name: string }[];
  info: DetailRow[];
  timeline: { date: string; label: string }[];
};

export type ContractRequest = BusinessRequest & { detail: ContractDetail };

export type InterviewDecision = "accepted" | "declined";

export type ContractDecision =
  | { status: "signed"; signatureFile: string; at: string }
  | { status: "declined"; at: string };
