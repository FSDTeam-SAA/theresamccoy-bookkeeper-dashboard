import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { EngagementTable } from "@/features/engagement/components/engagement-table";
import {
  ENGAGEMENT_SUBTITLE,
  ENGAGEMENT_TITLE,
} from "@/features/engagement/constants";

export const metadata: Metadata = {
  title: "Engagement | Bookkeeper Dashboard",
};

export default function EngagementPage() {
  return (
    <>
      <DashboardHeader
        title={ENGAGEMENT_TITLE}
        subtitle={ENGAGEMENT_SUBTITLE}
      />
      <EngagementTable />
    </>
  );
}
