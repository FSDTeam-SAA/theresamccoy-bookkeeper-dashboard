import type { Metadata } from "next";
import { COURSES, findCourse } from "./constants";

export type CourseParams = { slug: string };

export const courseStaticParams = (): CourseParams[] =>
  COURSES.map(({ slug }) => ({ slug }));

export async function courseMetadata(
  params: Promise<CourseParams>,
  section?: string,
): Promise<Metadata> {
  const { slug } = await params;
  const title = findCourse(slug)?.title ?? "Course";
  return {
    title: `${section ? `${section} · ` : ""}${title} | Bookkeeper Dashboard`,
  };
}

/** Course detail data exists only for courses with published content. */
export const coursesWithDetail = () =>
  COURSES.filter((course) => course.detail);
