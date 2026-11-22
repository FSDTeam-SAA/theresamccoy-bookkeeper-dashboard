import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CourseDetailFrame } from "@/features/courses/components/course-detail-frame";
import { ResourcesList } from "@/features/courses/components/resources-list";
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
  return courseMetadata(params, "Resources");
}

export default async function CourseResourcesPage({
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
      <CourseDetailFrame slug={slug} activeTab="resources">
        <ResourcesList slug={slug} />
      </CourseDetailFrame>
    </>
  );
}
