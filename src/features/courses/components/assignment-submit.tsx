"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ICONS,
  UPLOAD_ACCEPT,
  UPLOAD_MAX_BYTES,
  courseAssignmentsHref,
  findAssignment,
  findCourse,
} from "../constants";
import { progressKey, useCoursesStore } from "../store";
import { AssignmentStatus } from "./assignment-status";

const ALLOWED_EXTENSIONS = UPLOAD_ACCEPT.split(",");

function validateFile(file: File): string | undefined {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension))
    return "Upload a PDF, DOCX or XLSX file.";
  if (file.size > UPLOAD_MAX_BYTES) return "That file is larger than 10 MB.";
  return undefined;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Assignment submission (Figma 11392:7917). The dropzone is a real button so
 * it works by click and keyboard as well as drag and drop. The upload API does
 * not exist yet, so a submission is recorded locally by file name.
 */
export function AssignmentSubmit({
  slug,
  assignmentId,
}: {
  slug: string;
  assignmentId: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const submitAssignment = useCoursesStore((state) => state.submitAssignment);

  const course = findCourse(slug)!;
  const assignment = findAssignment(slug, assignmentId)!;
  const backHref = courseAssignmentsHref(slug);

  const choose = (next: File | undefined) => {
    if (!next) return;
    const problem = validateFile(next);
    setError(problem);
    setFile(problem ? undefined : next);
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files[0]);
  };

  const onUpload = () => {
    if (!file) {
      setError("Choose a file to upload.");
      dropzoneRef.current?.focus();
      return;
    }
    submitAssignment(progressKey(slug, assignmentId), file.name);
    toast.success("Assignment submitted", { description: file.name });
    router.push(backHref);
  };

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6">
      <article
        aria-labelledby="assignment-title"
        className="flex flex-col gap-6 rounded-[8px] bg-white px-4 py-6"
      >
        <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-[6px] text-[14px] leading-[1.2] text-[#6a6a6a]">
            <p className="uppercase">Assignment · {course.title}</p>
            <h1
              id="assignment-title"
              className="text-[20px] font-semibold text-ink sm:text-[24px]"
            >
              {assignment.title}
            </h1>
            <p>
              Due: {assignment.due} · Instructor: {assignment.instructor}
            </p>
          </div>
          <AssignmentStatus slug={slug} assignmentId={assignmentId} />
        </div>

        <section className="flex flex-col gap-4 rounded-[8px] bg-[#f5f5f5] p-4 text-[16px] leading-[1.5] text-[#6a6a6a]">
          <h2 className="text-[20px] leading-[1.2] font-semibold text-ink">
            Instructions
          </h2>
          <p>{assignment.lead}</p>
          <ul className="flex list-disc flex-col gap-1 ps-6">
            {assignment.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[16px] leading-[1.2] font-semibold text-ink">
            <label htmlFor={inputId}>Upload Your Work</label>
          </h2>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={UPLOAD_ACCEPT}
            tabIndex={-1}
            className="sr-only"
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              choose(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button
            ref={dropzoneRef}
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-[8px] border border-dashed p-4 text-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40 motion-reduce:transition-none",
              dragging
                ? "border-brand-800 bg-brand-50"
                : "border-muted-text bg-[#f5f5f5] hover:bg-[#efefef]",
              error && "border-alert",
            )}
          >
            <Image src={ICONS.uploadDropzone} width={40} height={40} alt="" />
            <span className="flex flex-col gap-2 text-[#6a6a6a]">
              <span className="text-[16px] leading-[1.2] font-semibold sm:text-[18px]">
                Click to upload or drag and drop
              </span>
              <span className="text-[14px] leading-[1.2] font-light">
                PDF, DOCX, XLSX up to 10 MB
              </span>
            </span>
          </button>

          {file ? (
            <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[#d5e4e3] px-4 py-3 text-[14px] leading-[1.2]">
              <span className="min-w-0 truncate text-ink" title={file.name}>
                {file.name}{" "}
                <span className="text-[#6a6a6a]">
                  · {formatSize(file.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setFile(undefined)}
                aria-label={`Remove ${file.name}`}
                className="cursor-pointer rounded-md p-1 text-[#6a6a6a] outline-none hover:bg-mist hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-400/40"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="text-[14px] leading-[1.2] text-alert"
            >
              {error}
            </p>
          ) : null}
        </section>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="brand"
            onClick={onUpload}
            className="h-[42px] w-[129px] rounded-[8px] p-4 text-[14px] leading-[1.5] font-semibold"
          >
            Upload
            <Image src={ICONS.uploadLight} width={18} height={18} alt="" />
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[42px] w-[132px] rounded-[8px] border-muted-text/34 bg-white p-4 text-[14px] leading-[1.5] font-semibold text-[#6a6a6a] shadow-none hover:bg-mist hover:text-ink"
          >
            <Link href={backHref}>Cancel</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
