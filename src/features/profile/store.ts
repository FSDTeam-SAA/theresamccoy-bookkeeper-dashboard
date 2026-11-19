import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_PROFILE } from "./constants";
import type {
  Certificate,
  OtherDetails,
  PersonalInfo,
  PortfolioItem,
  Profile,
} from "./types";

/**
 * Bookkeeper profile, persisted locally until a profile endpoint exists.
 * Components only talk to these actions, so they can be swapped for API
 * mutations later without touching the UI.
 */
type ProfileState = {
  profile: Profile;
  updatePersonal: (personal: PersonalInfo) => void;
  setSkills: (skills: string[]) => void;
  setCertificates: (certificates: Certificate[]) => void;
  setPortfolio: (portfolio: PortfolioItem[]) => void;
  updateOther: (other: OtherDetails) => void;
  setPhotoFileName: (fileName: string) => void;
  setResumeFileName: (fileName: string) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => {
      const patch = (partial: Partial<Profile>) =>
        set((state) => ({ profile: { ...state.profile, ...partial } }));
      return {
        profile: DEFAULT_PROFILE,
        updatePersonal: (personal) => patch({ personal }),
        setSkills: (skills) => patch({ skills }),
        setCertificates: (certificates) => patch({ certificates }),
        setPortfolio: (portfolio) => patch({ portfolio }),
        updateOther: (other) => patch({ other }),
        setPhotoFileName: (photoFileName) => patch({ photoFileName }),
        setResumeFileName: (resumeFileName) => patch({ resumeFileName }),
        reset: () => set({ profile: DEFAULT_PROFILE }),
      };
    },
    {
      name: "bookkeeper-profile",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
      // Rehydrated on the client only (see useProfileHydrated) to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
);

/** Rehydrates the persisted profile on mount and reports when it is ready. */
export function useProfileHydrated() {
  const hydrated = useSyncExternalStore(
    (onChange) => useProfileStore.persist.onFinishHydration(onChange),
    () => useProfileStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (!useProfileStore.persist.hasHydrated()) {
      void useProfileStore.persist.rehydrate();
    }
  }, []);

  return hydrated;
}

let idCounter = 0;
export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(idCounter += 1)}`;
