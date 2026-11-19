import type { Metadata } from "next";
import { OverviewPage } from "@/features/overview/pages/overview-page";

export const metadata: Metadata = {
  title: "Dashboard Overview | Bookkeeper Dashboard",
};

export default function DashboardPage() {
  return <OverviewPage />;
}
