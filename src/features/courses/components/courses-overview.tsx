"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ACCENTS,
  COURSES,
  CURRENT_COURSE_SLUG,
  ICONS,
  SEARCH_PLACEHOLDER,
  courseHref,
  courseStats,
  currentCourseHighlight,
  findCourse,
  lessonHref,
  percentOf,
} from "../constants";
import type { Course } from "../types";
import { Pill, ProgressBar, notifyComingSoon } from "./course-ui";

const statCard =
  "flex min-h-[112px] flex-col justify-center gap-4 rounded-[8px] bg-mist-50 p-4 drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] sm:min-h-[139px]";
const outlineButton =
  "h-[46px] rounded-[8px] border-brand-900 bg-white px-8 text-[16px] leading-[1.2] font-normal";

function CourseMeta({ course }: { course: Course }) {
  return (
    <p className="text-[14px] leading-[1.2] font-light text-[#4d5a6d]">
      Instructor: {course.instructor} · {course.level}
    </p>
  );
}

function CurrentCourseCard({ course }: { course: Course }) {
  const detail = course.detail!;
  const continueHref = lessonHref(course.slug, detail.currentLessonId);
  const facts = [
    { label: "CURRENT LESSON", value: currentCourseHighlight.currentLesson },
    { label: "Est. COMPLETION", value: currentCourseHighlight.estCompletion },
    { label: "TIME REMAINING", value: currentCourseHighlight.timeRemaining },
  ];

  return (
    <section
      aria-labelledby="current-course-title"
      className="flex flex-col overflow-hidden rounded-[24px] drop-shadow-[4px_4px_5px_rgba(0,0,0,0.1)] md:flex-row"
    >
      <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-brand-900 px-6 py-8 text-center md:w-[201px]">
        <span className="flex size-[58px] items-center justify-center rounded-[10px] bg-white/10">
          <Image src={ICONS.capCurrent} width={29.5} height={25.5} alt="" />
        </span>
        <p className="text-[18px] leading-[1.2] font-semibold text-mist-50">
          Current Course
        </p>
        <Pill tone="onDark">In Progress</Pill>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <Pill tone="info" className="self-end">
            {detail.percent}% Complete
          </Pill>
          <h2
            id="current-course-title"
            className="text-[18px] leading-[1.2] font-semibold text-ink"
          >
            {course.title}
          </h2>
          <CourseMeta course={course} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[12px] leading-[1.2]">
            <p className="text-[#4d5a6d]">
              {currentCourseHighlight.moduleLabel}
            </p>
            <p className="text-brand-900">
              {detail.lessonsDone} of {detail.lessonsTotal} lessons
            </p>
          </div>
          <ProgressBar
            value={detail.percent}
            label={`${course.title} progress`}
            valueText={`${detail.lessonsDone} of ${detail.lessonsTotal} lessons`}
          />
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:gap-6">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-[9px]">
              <dt className="text-[12px] leading-[1.2] font-light text-[#64748b]">
                {fact.label}
              </dt>
              <dd className="text-[14px] leading-[1.2] font-medium text-ink">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            variant="brand"
            className="h-[46px] gap-[10px] rounded-[8px] px-8 text-[16px] leading-[1.2] font-normal text-white sm:w-[211px]"
          >
            <Link href={continueHref}>
              <Image src={ICONS.play} width={16} height={16} alt="" />
              Continue Learning
            </Link>
          </Button>
          <Button
            asChild
            variant="brand-outline"
            className={cn(outlineButton, "sm:w-[211px]")}
          >
            <Link href={courseHref(course.slug)}>View Course</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function AssignedCourseCard({
  course,
  wide,
}: {
  course: Course;
  wide: boolean;
}) {
  const accent = ACCENTS[course.accent];
  const percent = percentOf(course.lessonsDone, course.lessonsTotal);
  const completed = percent === 100;
  const titleId = `course-${course.slug}-title`;

  return (
    <li
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-6 rounded-[12px] border-t-4 bg-white p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] sm:p-6",
        accent.border,
        wide && "lg:col-span-2",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-[58px] shrink-0 items-center justify-center rounded-[10px]",
            accent.tile,
          )}
        >
          <Image src={accent.icon} width={30.4} height={26.4} alt="" />
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <h3
            id={titleId}
            className="text-[18px] leading-[1.2] font-semibold text-ink"
          >
            {course.title}
          </h3>
          <CourseMeta course={course} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[12px] leading-[1.2]">
          <p className="text-[#4d5a6d]">
            {course.lessonsDone} of {course.lessonsTotal} lessons
          </p>
          <p
            className={
              completed ? "font-semibold text-[#00832c]" : "text-brand-900"
            }
          >
            {percent}%
          </p>
        </div>
        <ProgressBar
          value={percent}
          label={`${course.title} progress`}
          valueText={`${course.lessonsDone} of ${course.lessonsTotal} lessons`}
          fillClassName={completed ? "bg-[#00832c]" : undefined}
        />
      </div>

      {completed ? (
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="success">Completed</Pill>
          <Button
            type="button"
            variant="brand-outline"
            onClick={() => notifyComingSoon("Certificate download")}
            className={cn(outlineButton, "h-11 w-[211px] gap-[10px]")}
          >
            Certificate
            <Image src={ICONS.certificate} width={16} height={16} alt="" />
          </Button>
        </div>
      ) : (
        <Button
          asChild
          variant="brand-outline"
          className={cn(outlineButton, "h-11 w-full gap-[10px] sm:w-[211px]")}
        >
          <Link href={courseHref(course.slug)}>
            Start Course
            <MaskIcon src={ICONS.arrowLine} size={22} className="rotate-90" />
          </Link>
        </Button>
      )}
    </li>
  );
}

/** Courses hub (Figma 11380:12299). */
export function CoursesOverview() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const current = findCourse(CURRENT_COURSE_SLUG)!;
  const continueHref = lessonHref(
    current.slug,
    current.detail!.currentLessonId,
  );

  const assigned = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return COURSES.filter(
      (course) => course.slug !== CURRENT_COURSE_SLUG,
    ).filter(
      (course) =>
        !needle ||
        [course.title, course.instructor, course.level].some((field) =>
          field.toLowerCase().includes(needle),
        ),
    );
  }, [deferredQuery]);

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex h-[52px] shrink-0 items-center lg:flex-1 gap-2 rounded-[12px] border border-brand-900/20 px-4 shadow-[1px_4px_8px_0px_rgba(0,0,0,0.12)] focus-within:ring-[3px] focus-within:ring-brand-400/40">
          <Image src={ICONS.search} width={20} height={20} alt="" />
          <label htmlFor={searchId} className="sr-only">
            Search courses
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={SEARCH_PLACEHOLDER}
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] leading-[1.2] text-ink outline-none placeholder:text-[#54595e]"
          />
        </div>
        <Button
          asChild
          variant="brand"
          className="h-[50px] gap-[10px] rounded-[8px] px-6 text-[16px] leading-[1.2] font-normal whitespace-normal text-white lg:w-[479px] lg:px-8"
        >
          <Link href={continueHref}>
            <Image src={ICONS.play} width={16} height={16} alt="" />
            <span className="truncate">
              Continue Learning — {current.title}
            </span>
            <MaskIcon
              src={ICONS.arrowOutline}
              size={16}
              className="rotate-90"
            />
          </Link>
        </Button>
      </div>

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
        aria-label="Course stats"
      >
        {courseStats.map((stat) => (
          <li key={stat.label} className={statCard}>
            <p className="font-wix text-[14px] leading-[1.2] text-grey-300">
              {stat.label}
            </p>
            <p className="flex items-center gap-3 text-[20px] leading-[1.2] font-semibold text-brand-900 sm:text-[24px]">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: stat.dot }}
              />
              {stat.value}
            </p>
          </li>
        ))}
      </ul>

      <CurrentCourseCard course={current} />

      <section
        aria-labelledby="assigned-courses"
        className="flex flex-col gap-6"
      >
        <h2
          id="assigned-courses"
          className="text-[24px] leading-[1.2] font-semibold text-ink"
        >
          Assigned Courses
        </h2>
        {assigned.length ? (
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {assigned.map((course, index) => (
              <AssignedCourseCard
                key={course.slug}
                course={course}
                // Odd counts lead with a full-width card, as in the design.
                wide={index === 0 && assigned.length % 2 === 1}
              />
            ))}
          </ul>
        ) : (
          <p
            role="status"
            className="rounded-[12px] bg-white p-6 text-[16px] text-[#6a6a6a]"
          >
            No courses match “{deferredQuery.trim()}”.
          </p>
        )}
      </section>
    </div>
  );
}
