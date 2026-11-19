"use client";

import { useApplicationsStore } from "@/store/applications.store";
import { useApplicationsHydrated } from "../hooks/use-applications-hydrated";
import { ApplicationsEmpty } from "./applications-empty";
import { ApplicationsList } from "./applications-list";

/** Chooses the empty state or the applications table from the local store. */
export function ApplicationsOverview() {
  const hydrated = useApplicationsHydrated();
  const applications = useApplicationsStore((s) => s.applications);

  if (!hydrated) {
    return (
      <div aria-busy="true" className="flex-1 px-4 py-12 sm:px-10">
        <span className="sr-only">Loading applications…</span>
      </div>
    );
  }

  return applications.length === 0 ? (
    <ApplicationsEmpty />
  ) : (
    <ApplicationsList applications={applications} />
  );
}
