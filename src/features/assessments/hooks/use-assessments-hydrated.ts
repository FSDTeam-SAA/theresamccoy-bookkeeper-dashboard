"use client";

import { useSyncExternalStore } from "react";
import { useAssessmentsStore } from "../store";

const subscribe = (onChange: () => void) =>
  useAssessmentsStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useAssessmentsStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** True once persisted assessment progress has been read from localStorage. */
export function useAssessmentsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
