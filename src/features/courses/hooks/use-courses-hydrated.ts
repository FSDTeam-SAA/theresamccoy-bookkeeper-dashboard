"use client";

import { useSyncExternalStore } from "react";
import { useCoursesStore } from "../store";

const subscribe = (onChange: () => void) =>
  useCoursesStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useCoursesStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** True once persisted course progress has been read from localStorage. */
export function useCoursesHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
