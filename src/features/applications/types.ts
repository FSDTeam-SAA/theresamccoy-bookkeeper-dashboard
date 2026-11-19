import type {
  ApplicationStatus,
  BookkeeperApplication,
} from "@/store/applications.store";

export type { ApplicationStatus, BookkeeperApplication };

export type CertificationRow = {
  title: string;
  year: string;
  document?: File;
};

export type ApplicationFilters = {
  query: string;
  status: ApplicationStatus | "all";
  specialization: string | "all";
};

export type PageToken = number | "ellipsis-start" | "ellipsis-end";
