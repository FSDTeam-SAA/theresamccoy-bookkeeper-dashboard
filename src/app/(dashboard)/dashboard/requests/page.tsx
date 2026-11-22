import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { InterviewRequests } from "@/features/interviews/components/interview-requests";
import { REQUESTS_SUBTITLE } from "@/features/interviews/constants";

export const metadata: Metadata = {
  title: "Interview Requests | Bookkeeper Dashboard",
};

export default function RequestsPage() {
  return (
    <>
      <DashboardHeader title="Interview" subtitle={REQUESTS_SUBTITLE} />
      <InterviewRequests />
    </>
  );
}
