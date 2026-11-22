import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AssignmentSubmit } from "@/features/courses/components/assignment-submit";
import {
  courseAssignmentsHref,
  findAssignment,
} from "@/features/courses/constants";
import { coursesWithDetail } from "@/features/courses/route-helpers";

type Params = { slug: string; assignmentId: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return coursesWithDetail().flatMap(({ slug, detail }) =>
    detail!.assignments.map(({ id }) => ({ slug, assignmentId: id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, assignmentId } = await params;
  return {
    title: `${findAssignment(slug, assignmentId)?.title ?? "Assignment"} | Bookkeeper Dashboard`,
  };
}

export default async function AssignmentSubmitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, assignmentId } = await params;
  if (!findAssignment(slug, assignmentId)) notFound();

  return (
    <>
      <DashboardHeader
        back={{ href: courseAssignmentsHref(slug), label: "Back to Course" }}
      />
      <AssignmentSubmit slug={slug} assignmentId={assignmentId} />
    </>
  );
}
