"use client";

import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ICONS,
  LESSON_VIEWS,
  findCourse,
  findLesson,
  lessonHref,
} from "../constants";
import { useCoursesHydrated } from "../hooks/use-courses-hydrated";
import { progressKey, useCoursesStore } from "../store";
import type { LessonStatus } from "../types";
import { Pill, ProgressBar, notifyComingSoon } from "./course-ui";

const panel = "rounded-[12px] bg-white";
const statusPill: Record<
  LessonStatus,
  { label: string; tone: "info" | "success" }
> = {
  done: { label: "Completed", tone: "success" },
  current: { label: "In Progress", tone: "info" },
  upcoming: { label: "Not Started", tone: "info" },
};

function LessonMarker({ status }: { status: LessonStatus }) {
  if (status === "done") {
    return (
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[rgba(16,185,129,0.1)] font-instrument text-[10px] leading-[15px] font-bold text-[#0b7a55]">
        <span aria-hidden="true">✓</span>
        <span className="sr-only">Completed</span>
      </span>
    );
  }
  return (
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand-900/9">
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-[3px]",
          status === "current" ? "bg-brand-900" : "bg-transparent",
        )}
      />
      <span className="sr-only">
        {status === "current" ? "Current lesson" : "Not started"}
      </span>
    </span>
  );
}

/** Lesson player (Figma 11380:12496). No media source exists yet, so play toasts. */
export function LessonPlayer({
  slug,
  lessonId,
}: {
  slug: string;
  lessonId: string;
}) {
  const notesId = useId();
  const course = findCourse(slug)!;
  const { module: courseModule, lesson } = findLesson(slug, lessonId)!;
  const view = LESSON_VIEWS[lessonId];
  const noteKey = progressKey(slug, lessonId);
  const hydrated = useCoursesHydrated();
  const note = useCoursesStore((state) => state.notes[noteKey] ?? "");
  const setNote = useCoursesStore((state) => state.setNote);
  const status = statusPill[lesson.status];
  const topic = view?.topic ?? courseModule.title;

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-6">
      <section
        aria-label="Lesson video"
        className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[24px] bg-brand-900 px-4 pt-10 pb-6 sm:min-h-[420px] sm:px-10 lg:min-h-[555px]"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <button
            type="button"
            onClick={() => notifyComingSoon("Video playback")}
            aria-label={`Play ${lesson.title}`}
            className="cursor-pointer rounded-full transition-transform outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-mist/60 motion-reduce:transition-none"
          >
            <Image
              src={ICONS.playCircle}
              width={109}
              height={109}
              alt=""
              className="size-20 sm:size-[109px]"
            />
          </button>
          <div className="flex max-w-[336px] flex-col gap-1 leading-[1.2]">
            <h1 className="text-[20px] font-semibold text-mist-50 sm:text-[24px]">
              {lesson.title}
            </h1>
            <p className="text-[16px] font-light text-[#afb2b1]">
              {topic} · {lesson.duration}
            </p>
          </div>
        </div>

        {view ? (
          <div className="mt-8 flex flex-col gap-2">
            <ProgressBar
              value={view.watched}
              label="Playback position"
              valueText={`${view.elapsed} of ${view.duration}`}
              trackClassName="bg-[#828282]"
              fillClassName="bg-mist"
            />
            <div className="flex items-center justify-between text-[14px] leading-[1.2] text-brand-300">
              <span>{view.elapsed}</span>
              <span>{view.duration}</span>
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_445px]">
        <div className="flex flex-col gap-6">
          <section className={cn(panel, "flex items-start gap-6 p-4 sm:p-6")}>
            <div className="flex min-w-0 flex-1 flex-col gap-2 leading-[1.2]">
              <p className="text-[14px] font-light text-[#4d5a6d] uppercase">
                {topic}
              </p>
              <h2 className="text-[18px] font-semibold text-ink">
                {lesson.title}
              </h2>
              <p className="text-[14px] font-light text-[#4d5a6d]">
                Instructor: {course.instructor} · {lesson.duration}
              </p>
            </div>
            <Pill tone={status.tone}>{status.label}</Pill>
          </section>

          <section className={cn(panel, "flex flex-col gap-2 p-4 sm:p-6")}>
            <div className="flex items-center gap-2">
              <label
                htmlFor={notesId}
                className="flex-1 text-[18px] leading-[1.2] font-semibold text-ink"
              >
                My Notes
              </label>
              <Pill tone={status.tone}>{status.label}</Pill>
            </div>
            <textarea
              id={notesId}
              value={hydrated ? note : ""}
              disabled={!hydrated}
              onChange={(event) => setNote(noteKey, event.target.value)}
              placeholder="Add notes for this lesson…"
              rows={6}
              className="min-h-[170px] w-full resize-y rounded-[8px] bg-[rgba(95,114,117,0.1)] p-4 text-[14px] leading-[1.5] font-light text-ink outline-none placeholder:text-[#4d5a6d] focus-visible:ring-[3px] focus-visible:ring-brand-400/40"
            />
            <p className="text-[12px] leading-[1.2] text-[#6a6a6a]">
              Notes are saved on this device.
            </p>
          </section>
        </div>

        <nav
          aria-label={`${courseModule.title} lessons`}
          className={cn(panel, "flex flex-col gap-[19px] p-4")}
        >
          <div className="flex flex-col gap-[6px] text-[14px] leading-[1.2]">
            <h2 className="font-medium text-ink">
              Module {courseModule.number}: {courseModule.title}
            </h2>
            <p className="font-light text-[#6a6a6a]">
              {courseModule.lessonsDone} of {courseModule.lessonsTotal} lessons
              complete
            </p>
          </div>
          <ol className="flex flex-col py-2">
            {courseModule.lessons.map((item, index) => {
              const active = item.id === lessonId;
              return (
                <li key={item.id}>
                  <Link
                    href={lessonHref(slug, item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-start gap-2 rounded-[4px] py-3 outline-none hover:bg-mist focus-visible:ring-[3px] focus-visible:ring-brand-400/40",
                      index === 0 && "pt-0",
                      index < courseModule.lessons.length - 1 &&
                        "border-b-[0.5px] border-[rgba(100,116,139,0.51)]",
                    )}
                  >
                    <LessonMarker status={item.status} />
                    <span className="flex min-w-0 flex-1 flex-col gap-[9px] text-[14px] leading-[1.2]">
                      <span
                        className={cn(
                          "font-medium text-ink",
                          active && "underline underline-offset-4",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="font-light text-[#6a6a6a]">
                        {item.duration}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
