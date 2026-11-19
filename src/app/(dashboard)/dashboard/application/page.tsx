import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AssessmentsHub } from "@/features/assessments/components/assessments-hub";
import { APPLICATION_SUBTITLE } from "@/features/assessments/constants";

export const metadata: Metadata = {
  title: "Application | Bookkeeper Dashboard",
};

export default function ApplicationPage() {
  return (
    <>
      <DashboardHeader title="Application" subtitle={APPLICATION_SUBTITLE} />
      <AssessmentsHub />
    </>
  );
}
