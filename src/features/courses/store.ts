import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AssignmentSubmission = { fileName: string; submittedAt: string };

/**
 * Persisted learner state until the LMS API exists: per-lesson notes and
 * assignment submissions (file name only — the file itself is not stored).
 */
type CoursesState = {
  /** `${courseSlug}/${lessonId}` -> note text. */
  notes: Record<string, string>;
  /** `${courseSlug}/${assignmentId}` -> submission. */
  submissions: Record<string, AssignmentSubmission>;
  setNote: (key: string, value: string) => void;
  submitAssignment: (key: string, fileName: string) => void;
};

export const progressKey = (slug: string, id: string) => `${slug}/${id}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSubmission = (value: unknown): value is AssignmentSubmission =>
  isRecord(value) &&
  typeof value.fileName === "string" &&
  typeof value.submittedAt === "string";

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set) => ({
      notes: {},
      submissions: {},
      setNote: (key, value) =>
        set((state) => ({ notes: { ...state.notes, [key]: value } })),
      submitAssignment: (key, fileName) =>
        set((state) => ({
          submissions: {
            ...state.submissions,
            [key]: { fileName, submittedAt: new Date().toISOString() },
          },
        })),
    }),
    {
      name: "bookkeeper-courses",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ notes, submissions }) => ({ notes, submissions }),
      // Drop anything malformed from an older or hand-edited saved state.
      merge: (persisted, current) => {
        const saved = isRecord(persisted) ? persisted : {};
        const notes: Record<string, string> = {};
        const submissions: Record<string, AssignmentSubmission> = {};
        if (isRecord(saved.notes)) {
          for (const [key, note] of Object.entries(saved.notes)) {
            if (typeof note === "string") notes[key] = note;
          }
        }
        if (isRecord(saved.submissions)) {
          for (const [key, submission] of Object.entries(saved.submissions)) {
            if (isSubmission(submission)) submissions[key] = submission;
          }
        }
        return { ...current, notes, submissions };
      },
    },
  ),
);
