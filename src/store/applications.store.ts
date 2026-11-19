import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Bookkeeper applications submitted from the dashboard ("Submit Application")
 * or the onboarding flow (/apply). Persisted locally until a backend endpoint
 * exists — swap `submitApplication` for an API mutation when it does.
 */
export type ApplicationStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

export type ApplicationSource = "dashboard" | "onboarding";

export type BookkeeperApplication = {
  id: string;
  submittedAt: string; // ISO date
  professionalTitle: string;
  experience: string; // e.g. "5+ Years"
  specializations: string[];
  status: ApplicationStatus;
  source: ApplicationSource;
  resumeFileName?: string;
};

export type NewApplication = Omit<
  BookkeeperApplication,
  "id" | "submittedAt" | "status"
>;

type ApplicationsState = {
  applications: BookkeeperApplication[];
  submitApplication: (input: NewApplication) => BookkeeperApplication;
};

const formatId = (n: number) => `APP-${String(n).padStart(5, "0")}`;

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],
      submitApplication: (input) => {
        const highest = get().applications.reduce(
          (max, app) => Math.max(max, Number(app.id.replace(/\D/g, "")) || 0),
          100,
        );
        const application: BookkeeperApplication = {
          ...input,
          id: formatId(highest + 1),
          submittedAt: new Date().toISOString(),
          status: "Submitted",
        };
        set((state) => ({
          applications: [application, ...state.applications],
        }));
        return application;
      },
    }),
    {
      name: "bookkeeper-applications",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
