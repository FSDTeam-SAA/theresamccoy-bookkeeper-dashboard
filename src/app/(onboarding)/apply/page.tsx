import type { Metadata } from "next";
import {
  ApplyHero,
  ApplyTopBar,
} from "@/features/onboarding/components/apply-header";
import { ApplyWizard } from "@/features/onboarding/components/apply-wizard";

export const metadata: Metadata = {
  title: "Join the Network | Bookkeeper Dashboard",
  description:
    "Apply to join the CPA-Vetted Bookkeeper Network on The Bookkeepers Marketplace.",
};

export default function ApplyPage() {
  return (
    <>
      <ApplyTopBar />
      <main className="mx-auto flex w-full max-w-[calc(1486px+4rem)] flex-col items-center gap-8 px-4 pt-6 pb-16 sm:px-6 sm:pt-[42px] lg:px-8">
        <ApplyHero />
        <ApplyWizard />
      </main>
    </>
  );
}
