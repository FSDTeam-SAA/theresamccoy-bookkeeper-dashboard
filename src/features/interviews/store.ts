import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ContractDecision, InterviewDecision } from "./types";

/**
 * Persisted request decisions until the requests API exists. Uploaded files
 * are tracked by name only — the files themselves are not stored.
 */
type RequestsState = {
  interviews: Record<string, InterviewDecision>;
  contracts: Record<string, ContractDecision>;
  /** contract id -> names of files the bookkeeper uploaded. */
  projectFiles: Record<string, string[]>;
  decideInterview: (id: string, decision: InterviewDecision) => void;
  undoInterview: (id: string) => void;
  signContract: (id: string, signatureFile: string) => void;
  declineContract: (id: string) => void;
  addProjectFile: (id: string, fileName: string) => void;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isInterviewDecision = (value: unknown): value is InterviewDecision =>
  value === "accepted" || value === "declined";

const isContractDecision = (value: unknown): value is ContractDecision =>
  isRecord(value) &&
  typeof value.at === "string" &&
  (value.status === "declined" ||
    (value.status === "signed" && typeof value.signatureFile === "string"));

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set) => ({
      interviews: {},
      contracts: {},
      projectFiles: {},
      decideInterview: (id, decision) =>
        set((state) => ({
          interviews: { ...state.interviews, [id]: decision },
        })),
      undoInterview: (id) =>
        set((state) => {
          const interviews = { ...state.interviews };
          delete interviews[id];
          return { interviews };
        }),
      signContract: (id, signatureFile) =>
        set((state) => ({
          contracts: {
            ...state.contracts,
            [id]: {
              status: "signed",
              signatureFile,
              at: new Date().toISOString(),
            },
          },
        })),
      declineContract: (id) =>
        set((state) => ({
          contracts: {
            ...state.contracts,
            [id]: { status: "declined", at: new Date().toISOString() },
          },
        })),
      addProjectFile: (id, fileName) =>
        set((state) => ({
          projectFiles: {
            ...state.projectFiles,
            [id]: [...(state.projectFiles[id] ?? []), fileName],
          },
        })),
    }),
    {
      name: "bookkeeper-requests",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ interviews, contracts, projectFiles }) => ({
        interviews,
        contracts,
        projectFiles,
      }),
      // Drop anything malformed from an older or hand-edited saved state.
      merge: (persisted, current) => {
        const saved = isRecord(persisted) ? persisted : {};
        const interviews: Record<string, InterviewDecision> = {};
        const contracts: Record<string, ContractDecision> = {};
        const projectFiles: Record<string, string[]> = {};
        if (isRecord(saved.interviews)) {
          for (const [id, decision] of Object.entries(saved.interviews)) {
            if (isInterviewDecision(decision)) interviews[id] = decision;
          }
        }
        if (isRecord(saved.contracts)) {
          for (const [id, decision] of Object.entries(saved.contracts)) {
            if (isContractDecision(decision)) contracts[id] = decision;
          }
        }
        if (isRecord(saved.projectFiles)) {
          for (const [id, files] of Object.entries(saved.projectFiles)) {
            if (
              Array.isArray(files) &&
              files.every((name) => typeof name === "string")
            ) {
              projectFiles[id] = files;
            }
          }
        }
        return { ...current, interviews, contracts, projectFiles };
      },
    },
  ),
);
