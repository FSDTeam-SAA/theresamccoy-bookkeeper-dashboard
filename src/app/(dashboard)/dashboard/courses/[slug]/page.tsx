import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CourseDetailFrame } from "@/features/courses/components/course-detail-frame";
import { ModulesList } from "@/features/courses/components/modules-list";
import { COURSES_HREF, findCourse } from "@/features/courses/constants";
import {
  courseMetadata,
  courseStaticParams,
  type CourseParams,
} from "@/features/courses/route-helpers";

export const dynamicParams = false;
export const generateStaticParams = courseStaticParams;

export function generateMetadata({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  return courseMetadata(params);
}

export default async function CourseModulesPage({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  const { slug } = await params;
  if (!findCourse(slug)) notFound();

  return (
    <>
      <DashboardHeader
        back={{ href: COURSES_HREF, label: "Back to Courses" }}
      />
      <CourseDetailFrame slug={slug} activeTab="modules">
        <ModulesList slug={slug} />
      </CourseDetailFrame>
    </>
  );
}
