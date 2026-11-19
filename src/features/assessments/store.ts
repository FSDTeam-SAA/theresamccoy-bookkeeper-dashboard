import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Answers } from "./types";

/**
 * Persisted assessment progress: completion timestamps (which drive the
 * unlock chain on the hub) and autosaved draft answers per assessment.
 */
type AssessmentsState = {
  /** slug -> ISO timestamp of the latest submission. */
  completed: Record<string, string>;
  /** slug -> draft answers keyed by field id. */
  drafts: Record<string, Answers>;
  setAnswer: (slug: string, fieldId: string, value: string) => void;
  markCompleted: (slug: string, submittedAt?: string) => void;
  clearDraft: (slug: string) => void;
};

const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === "object" &&
  value !== null &&
  Object.values(value).every((entry) => typeof entry === "string");

export const useAssessmentsStore = create<AssessmentsState>()(
  persist(
    (set) => ({
      completed: {},
      drafts: {},
      setAnswer: (slug, fieldId, value) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [slug]: { ...state.drafts[slug], [fieldId]: value },
          },
        })),
      markCompleted: (slug, submittedAt = new Date().toISOString()) =>
        set((state) => ({ completed: { ...state.completed, [slug]: submittedAt } })),
      clearDraft: (slug) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[slug];
          return { drafts };
        }),
    }),
    {
      name: "bookkeeper-assessments",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ completed, drafts }) => ({ completed, drafts }),
      // Drop anything malformed from an older or hand-edited saved state.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AssessmentsState>;
        const drafts: Record<string, Answers> = {};
        if (saved.drafts && typeof saved.drafts === "object") {
          for (const [slug, answers] of Object.entries(saved.drafts)) {
            if (isStringRecord(answers)) drafts[slug] = answers;
          }
        }
        return {
          ...current,
          completed: isStringRecord(saved.completed) ? saved.completed : {},
          drafts,
        };
      },
    },
  ),
);
