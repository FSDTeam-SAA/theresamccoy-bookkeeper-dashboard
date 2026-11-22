"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ICONS,
  courseAssignmentsHref,
  courseHref,
  courseResourcesHref,
  findCourse,
  lessonHref,
} from "../constants";
import { Chip, ProgressBar, notifyComingSoon } from "./course-ui";

export type CourseTab = "modules" | "assignments" | "resources";

const TABS: { id: CourseTab; label: string; href: (slug: string) => string }[] =
  [
    { id: "modules", label: "Modules & Lessons", href: courseHref },
    { id: "assignments", label: "Assignments", href: courseAssignmentsHref },
    { id: "resources", label: "Resources", href: courseResourcesHref },
  ];

/**
 * Course header, progress and tab navigation shared by the Modules,
 * Assignments and Resources screens (Figma 11392:7707 / 7845 / 7967).
 * Tabs are links so each view is deep-linkable.
 */
export function CourseDetailFrame({
  slug,
  activeTab,
  children,
}: {
  slug: string;
  activeTab: CourseTab;
  children: React.ReactNode;
}) {
  const course = findCourse(slug)!;
  const detail = course.detail;

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-[16px] bg-brand-800">
              <Image src={ICONS.book} width={24} height={24} alt="" />
            </span>
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-[22px] leading-[1.2] font-semibold text-brand-900 sm:text-[24px]">
                  {course.title}
                </h1>
                <p className="text-[14px] leading-[1.2] font-light text-muted-text">
                  Instructor: {course.instructor} ·{" "}
                  {detail?.level ?? course.level}
                  {" · "}
                  {course.lessonsTotal} lessons
                </p>
              </div>
              {detail ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="neutral">{detail.level}</Chip>
                  <Chip tone="info">{detail.percent}% Complete</Chip>
                </div>
              ) : null}
            </div>
          </div>

          {detail ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                asChild
                variant="brand"
                className="h-[42px] rounded-[8px] p-4 text-[14px] leading-[1.5] font-semibold"
              >
                <Link href={lessonHref(slug, detail.currentLessonId)}>
                  Resume Lesson
                  <Image
                    src={ICONS.resumePlay}
                    width={9.46}
                    height={12.17}
                    alt=""
                  />
                </Link>
              </Button>
              <Button
                type="button"
                variant="brand-outline"
                onClick={() => notifyComingSoon("Quizzes")}
                className="h-[42px] rounded-[8px] p-4 text-[12px] leading-[1.2] font-semibold"
              >
                Take Quiz
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-[10px] rounded-[8px] border border-[#d5e4e3] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] leading-[1.2]">
            <p className="text-brand-900">Course Progress</p>
            <p className="font-medium text-brand-800">
              {course.lessonsDone} of {course.lessonsTotal} lessons complete
            </p>
          </div>
          <ProgressBar
            size="sm"
            value={detail?.percent ?? 0}
            label="Course progress"
            valueText={`${course.lessonsDone} of ${course.lessonsTotal} lessons complete`}
          />
        </div>
      </div>

      <nav
        aria-label="Course sections"
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <ul className="flex min-w-max">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <li key={tab.id}>
                <Link
                  href={tab.href(slug)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center justify-center border-b-2 px-4 text-center text-[14px] leading-[1.2] whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40",
                    active
                      ? "min-w-[135px] border-brand-900 font-semibold text-brand-900"
                      : "border-[#e1e4e3] font-light text-muted-text hover:text-brand-900",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {detail ? (
        children
      ) : (
        <p
          role="status"
          className="rounded-[8px] bg-white p-6 text-[16px] leading-[1.5] text-[#6a6a6a]"
        >
          Lessons for this course haven’t been published yet. Check back soon.
        </p>
      )}
    </div>
  );
}
