"use client";

import Image from "next/image";
import Link from "next/link";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { ICONS, findCourse, lessonHref } from "../constants";
import type { CourseModule, Lesson, ModuleStatus } from "../types";
import { StatusPill, type StatusTone } from "./course-ui";

const MODULE_STATUS: Record<
  ModuleStatus,
  { label: string; tone: StatusTone } | null
> = {
  completed: { label: "Completed", tone: "completed" },
  "in-progress": { label: "In Progress", tone: "in-progress" },
  "not-started": null,
};

function RowText({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
      <span className="text-[16px] leading-[1.5] font-semibold text-ink sm:text-[18px]">
        {title}
      </span>
      <span className="text-[14px] leading-[1.2] font-normal text-[#6a6a6a] sm:text-[16px]">
        {meta}
      </span>
    </span>
  );
}

function LessonRow({ slug, lesson }: { slug: string; lesson: Lesson }) {
  const current = lesson.status === "current";
  const done = lesson.status === "done";

  return (
    <li>
      <Link
        href={lessonHref(slug, lesson.id)}
        aria-current={current ? "step" : undefined}
        className={cn(
          "flex min-h-[98px] items-center gap-2 px-4 py-6 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40 focus-visible:ring-inset sm:px-8",
          current
            ? "bg-[#f0f0f0] hover:bg-[#e8e8e8]"
            : "border-b-[0.5px] border-[#939393] hover:bg-mist",
        )}
      >
        <span className="flex flex-1 items-center gap-[10px]">
          <Image
            src={current ? ICONS.lessonCurrent : ICONS.tick}
            width={32}
            height={32}
            alt=""
          />
          <RowText title={lesson.title} meta={lesson.duration} />
        </span>
        {done ? <StatusPill tone="completed">Done</StatusPill> : null}
        {current ? <StatusPill tone="current">Current</StatusPill> : null}
      </Link>
    </li>
  );
}

function ModuleItem({
  slug,
  courseModule,
}: {
  slug: string;
  courseModule: CourseModule;
}) {
  const status = MODULE_STATUS[courseModule.status];
  const inProgress = courseModule.status === "in-progress";

  return (
    <AccordionPrimitive.Item
      value={courseModule.id}
      className={cn(
        "overflow-hidden rounded-[8px] bg-white",
        inProgress
          ? "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]"
          : "drop-shadow-[4px_2px_3px_rgba(0,0,0,0.1)]",
      )}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex min-h-[82px] w-full cursor-pointer items-center gap-2 p-4 outline-none hover:bg-mist focus-visible:ring-[3px] focus-visible:ring-brand-400/40 focus-visible:ring-inset data-[state=open]:border-b-[0.5px] data-[state=open]:border-[#939393] data-[state=open]:pt-8 data-[state=open]:pb-6 sm:data-[state=open]:px-8">
          <span className="flex flex-1 items-center gap-[10px]">
            <Image
              src={inProgress ? ICONS.moduleInProgress : ICONS.tick}
              width={32}
              height={32}
              alt=""
            />
            <RowText
              title={courseModule.title}
              meta={`${courseModule.lessonsDone}/${courseModule.lessonsTotal} lessons complete`}
            />
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {status ? (
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
            ) : null}
            <Image
              src={ICONS.caret}
              width={16}
              height={16}
              alt=""
              className="transition-transform duration-200 group-data-[state=open]:-scale-y-100 motion-reduce:transition-none"
            />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
        {courseModule.lessons.length ? (
          <ul aria-label={`${courseModule.title} lessons`}>
            {courseModule.lessons.map((lesson) => (
              <LessonRow key={lesson.id} slug={slug} lesson={lesson} />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-[16px] leading-[1.5] text-[#6a6a6a] sm:px-8">
            All {courseModule.lessonsTotal} lessons in this module are complete.
          </p>
        )}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

/** Modules & Lessons tab (Figma 11392:7707). The current module starts open. */
export function ModulesList({ slug }: { slug: string }) {
  const detail = findCourse(slug)!.detail!;

  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={[detail.currentModuleId]}
      className="flex flex-col gap-4"
    >
      {detail.modules.map((courseModule) => (
        <ModuleItem
          key={courseModule.id}
          slug={slug}
          courseModule={courseModule}
        />
      ))}
    </AccordionPrimitive.Root>
  );
}
