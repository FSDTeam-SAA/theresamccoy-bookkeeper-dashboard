export type EngagementStatus = "Active" | "Sign" | "Pending Signature";

export type Engagement = {
  id: string;
  bookkeeper: string;
  project: string;
  contractDate: string;
  contractPeriod: string;
  contractValue: string;
  status: EngagementStatus;
};
