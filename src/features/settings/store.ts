import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_PERSONAL_INFO } from "./constants";
import type { PersonalInfo } from "./types";

/**
 * Locally saved profile details until the account API exists.
 * Passwords are never stored here.
 */
type SettingsState = {
  personalInfo: PersonalInfo;
  savePersonalInfo: (info: PersonalInfo) => void;
};

const KEYS = Object.keys(DEFAULT_PERSONAL_INFO) as (keyof PersonalInfo)[];

const isPersonalInfo = (value: unknown): value is PersonalInfo =>
  typeof value === "object" &&
  value !== null &&
  KEYS.every(
    (key) => typeof (value as Record<string, unknown>)[key] === "string",
  );

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      personalInfo: DEFAULT_PERSONAL_INFO,
      savePersonalInfo: (info) => set({ personalInfo: info }),
    }),
    {
      name: "bookkeeper-settings",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ personalInfo }) => ({ personalInfo }),
      // Drop anything malformed from an older or hand-edited saved state.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingsState>;
        return {
          ...current,
          personalInfo: isPersonalInfo(saved.personalInfo)
            ? {
                firstName: saved.personalInfo.firstName,
                lastName: saved.personalInfo.lastName,
                email: saved.personalInfo.email,
                phone: saved.personalInfo.phone,
              }
            : current.personalInfo,
        };
      },
    },
  ),
);
