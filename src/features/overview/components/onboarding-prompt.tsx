"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApplicationsStore } from "@/store/applications.store";

/**
 * Not in Figma: nudges bookkeepers who signed up but have not finished the
 * onboarding application (/apply). Replace the local check with the backend's
 * onboarding status once it exists.
 */
export function OnboardingPrompt() {
  const hydrated = useSyncExternalStore(
    (onChange) => useApplicationsStore.persist.onFinishHydration(onChange),
    () => useApplicationsStore.persist.hasHydrated(),
    () => false,
  );
  const onboarded = useApplicationsStore((state) =>
    state.applications.some((app) => app.source === "onboarding"),
  );

  if (!hydrated || onboarded) return null;

  return (
    <section
      aria-label="Finish your application"
      className="flex flex-col gap-4 rounded-[8px] border border-brand-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-1 leading-[1.2]">
        <h2 className="text-[18px] font-semibold text-ink">
          Finish joining the CPA-Vetted Bookkeeper Network
        </h2>
        <p className="text-[14px] font-light text-muted-text">
          Complete your 5-step application to get matched with growing businesses.
        </p>
      </div>
      <Button asChild variant="brand" className="h-12 rounded-[4px] px-6 text-[16px] font-medium">
        <Link href="/apply">Continue application</Link>
      </Button>
    </section>
  );
}
