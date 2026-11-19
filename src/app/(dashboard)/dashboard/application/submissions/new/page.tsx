import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { COURSE_ROUTE } from "@/features/applications/constants";

export const metadata: Metadata = { title: "Apply as a Bookkeeper | Bookkeeper Dashboard" };

export default function NewApplicationPage() {
  return (
    <>
      <DashboardHeader back={{ href: COURSE_ROUTE, label: "Back to Course" }} />
      <main className="min-w-0 flex-1">
        <ApplicationForm />
      </main>
    </>
  );
}
