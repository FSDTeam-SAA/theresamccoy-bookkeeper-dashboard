"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProfileHydrated } from "../store";
import { EditCertificationsSection } from "./edit-certifications-section";
import { EditOtherSection } from "./edit-other-section";
import { EditPersonalSection } from "./edit-personal-section";
import { EditPortfolioSection } from "./edit-portfolio-section";
import { EditSkillsSection } from "./edit-skills-section";
import { EditSummaryCard } from "./edit-summary-card";

export function ProfileEdit() {
  // Forms seed their defaults from the store, so wait for the persisted profile.
  const hydrated = useProfileHydrated();

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading profile"
        className="flex flex-col gap-4"
      >
        <Skeleton className="h-[214px] w-full rounded-[8px] bg-white" />
        <Skeleton className="h-[420px] w-full rounded-[12px] bg-white" />
      </div>
    );
  }

  return (
    <>
      <EditSummaryCard />
      <EditPersonalSection />
      <EditSkillsSection />
      <EditCertificationsSection />
      <EditPortfolioSection />
      <EditOtherSection />
    </>
  );
}
