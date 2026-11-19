"use client";

import { useSyncExternalStore } from "react";
import { useApplicationsStore } from "@/store/applications.store";

const subscribe = (onChange: () => void) =>
  useApplicationsStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useApplicationsStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/**
 * True once the persisted applications have been read from localStorage.
 * Server render and the first client render both see `false`, so the empty
 * vs list decision never causes a hydration mismatch.
 */
export function useApplicationsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
