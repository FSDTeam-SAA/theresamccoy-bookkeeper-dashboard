"use client";

import { useSyncExternalStore } from "react";
import { useRequestsStore } from "../store";

const subscribe = (onChange: () => void) =>
  useRequestsStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useRequestsStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** True once persisted request decisions have been read from localStorage. */
export function useRequestsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
