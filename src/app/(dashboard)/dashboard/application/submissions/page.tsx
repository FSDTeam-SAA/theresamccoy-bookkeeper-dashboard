import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ApplicationsOverview } from "@/features/applications/components/applications-overview";
import { COURSE_ROUTE } from "@/features/applications/constants";

export const metadata: Metadata = { title: "Applications | Bookkeeper Dashboard" };

export default function ApplicationSubmissionsPage() {
  return (
    <>
      <DashboardHeader back={{ href: COURSE_ROUTE, label: "Back to Course" }} />
      <main className="flex min-w-0 flex-1 flex-col">
        <ApplicationsOverview />
      </main>
    </>
  );
}
