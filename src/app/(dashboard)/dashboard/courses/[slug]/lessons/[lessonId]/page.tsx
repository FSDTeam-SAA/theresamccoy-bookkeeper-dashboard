import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { LessonPlayer } from "@/features/courses/components/lesson-player";
import { COURSES_SUBTITLE, findLesson } from "@/features/courses/constants";
import { coursesWithDetail } from "@/features/courses/route-helpers";

type Params = { slug: string; lessonId: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return coursesWithDetail().flatMap(({ slug, detail }) =>
    detail!.modules.flatMap(({ lessons }) =>
      lessons.map(({ id }) => ({ slug, lessonId: id })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  return {
    title: `${findLesson(slug, lessonId)?.lesson.title ?? "Lesson"} | Bookkeeper Dashboard`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, lessonId } = await params;
  if (!findLesson(slug, lessonId)) notFound();

  return (
    <>
      <DashboardHeader title="Courses" subtitle={COURSES_SUBTITLE} />
      <LessonPlayer slug={slug} lessonId={lessonId} />
    </>
  );
}
