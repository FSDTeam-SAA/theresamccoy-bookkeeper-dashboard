"use client";

import { useSyncExternalStore } from "react";
import { useMessagesStore } from "../store";

const subscribe = (onChange: () => void) =>
  useMessagesStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useMessagesStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** True once persisted inbox state has been read from localStorage. */
export function useMessagesHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
