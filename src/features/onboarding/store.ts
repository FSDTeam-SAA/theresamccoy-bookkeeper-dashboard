import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { APPLY_STEPS } from "./constants";
import { EMPTY_DRAFT, type ApplyDraft } from "./schema";

/** Persisted draft of the /apply wizard so a refresh keeps progress. */
type OnboardingState = {
  step: number;
  draft: ApplyDraft;
  saveStep: <K extends keyof ApplyDraft>(key: K, values: ApplyDraft[K]) => void;
  goTo: (step: number) => void;
  reset: () => void;
};

const clampStep = (step: number) =>
  Math.min(Math.max(0, Math.trunc(step) || 0), APPLY_STEPS.length - 1);

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      draft: EMPTY_DRAFT,
      saveStep: (key, values) =>
        set((state) => ({ draft: { ...state.draft, [key]: values } })),
      goTo: (step) => set({ step: clampStep(step) }),
      reset: () => set({ step: 0, draft: EMPTY_DRAFT }),
    }),
    {
      name: "bookkeeper-apply-draft",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ step, draft }) => ({ step, draft }),
      // Fill any keys missing from an older/partial saved draft.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<OnboardingState>;
        const draft = { ...EMPTY_DRAFT };
        for (const key of Object.keys(EMPTY_DRAFT) as (keyof ApplyDraft)[]) {
          Object.assign(draft, {
            [key]: { ...EMPTY_DRAFT[key], ...(saved.draft?.[key] ?? {}) },
          });
        }
        return { ...current, step: clampStep(saved.step ?? 0), draft };
      },
    },
  ),
);
