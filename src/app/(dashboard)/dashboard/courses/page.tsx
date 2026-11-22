import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CoursesOverview } from "@/features/courses/components/courses-overview";
import { COURSES_SUBTITLE } from "@/features/courses/constants";

export const metadata: Metadata = { title: "Courses | Bookkeeper Dashboard" };

export default function CoursesPage() {
  return (
    <>
      <DashboardHeader title="Courses" subtitle={COURSES_SUBTITLE} />
      <CoursesOverview />
    </>
  );
}
