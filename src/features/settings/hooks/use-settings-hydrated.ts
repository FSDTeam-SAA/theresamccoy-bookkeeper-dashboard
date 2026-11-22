"use client";

import { useSyncExternalStore } from "react";
import { useSettingsStore } from "../store";

const subscribe = (onChange: () => void) =>
  useSettingsStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useSettingsStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** True once saved settings have been read from localStorage. */
export function useSettingsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
