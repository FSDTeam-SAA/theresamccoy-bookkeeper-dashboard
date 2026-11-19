"use client";

import { useRef } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "../store";
import { assessmentSchema, type AssessmentValues } from "../schema";
import { ASSESSMENT_HREF, RESUME_ACCEPT, RESUME_MAX_BYTES } from "../constants";
import { CircleCheckbox, FieldError, SectionHeader } from "./fields";
import {
  StepActions,
  formClass,
  useDraftSync,
  type StepProps,
} from "./step-shared";

const RESUME_PATTERN = /\.(pdf|docx?)$/i;

/** Step 4 has no Figma design; built in the same visual language. */
export function AssessmentStep({ onNext, onBack }: StepProps) {
  const saved = useOnboardingStore((s) => s.draft.assessment);
  const saveStep = useOnboardingStore((s) => s.saveStep);
  const form = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: saved,
    mode: "onTouched",
  });
  useDraftSync(form, "assessment");
  const fileInput = useRef<HTMLInputElement>(null);
  const {
    register,
    setValue,
    setError,
    formState: { errors },
  } = form;
  const resumeFileName = useWatch({
    control: form.control,
    name: "resumeFileName",
  });
  const resumeError = errors.resumeFileName?.message;

  const onFileChange = (file: File | undefined) => {
    if (!file) return;
    if (!RESUME_PATTERN.test(file.name)) {
      setError("resumeFileName", {
        message: "Upload a PDF, DOC or DOCX file",
      });
    } else if (file.size > RESUME_MAX_BYTES) {
      setError("resumeFileName", { message: "File must be 5 MB or smaller" });
    } else {
      // Only the file name is kept until an upload endpoint exists.
      setValue("resumeFileName", file.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <form
      noValidate
      className={formClass}
      onSubmit={form.handleSubmit((values) => {
        saveStep("assessment", values);
        onNext();
      })}
    >
      <SectionHeader
        stepHeading
        variant="dark"
        title="Skills assessment"
        subtitle="Complete the Bookkeeping Skills Assessment and upload your resume"
      />

      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Bookkeeping Skills Assessment" />
        <p className="max-w-3xl font-onest text-base leading-[1.5] text-ink">
          Every applicant completes the Bookkeeping Skills Assessment. It covers
          core bookkeeping fundamentals — reconciliations, A/R and A/P, and
          financial reporting — and helps us match you with the right clients.
          Take the assessment, then come back here to confirm and continue.
        </p>
        <Button
          asChild
          variant="brand-outline"
          className="h-[42px] w-full p-4 text-base font-semibold sm:w-[260px]"
        >
          <Link href={ASSESSMENT_HREF}>Take the assessment</Link>
        </Button>
        <div className="flex flex-col gap-2">
          <CircleCheckbox
            id="assessmentCompleted"
            label="I have completed the skills assessment *"
            aria-invalid={Boolean(errors.assessmentCompleted)}
            aria-describedby={
              errors.assessmentCompleted
                ? "assessmentCompleted-error"
                : undefined
            }
            {...register("assessmentCompleted")}
          />
          <FieldError
            id="assessmentCompleted"
            message={errors.assessmentCompleted?.message}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Resume" />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="resume"
            className="font-onest text-base leading-[1.2] text-ink"
          >
            Upload your resume *
          </label>
          <div
            className={cn(
              "flex min-h-[58px] flex-col gap-3 rounded-lg border bg-white p-2 pl-4 sm:flex-row sm:items-center",
              resumeError ? "border-destructive" : "border-black/30",
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-onest text-base leading-[1.2]",
                resumeFileName ? "text-ink" : "text-[#999]",
              )}
              aria-live="polite"
            >
              {resumeFileName || "No file chosen"}
            </span>
            <Button
              type="button"
              variant="brand"
              onClick={() => fileInput.current?.click()}
              className="h-[42px] px-6 text-base font-semibold"
              aria-describedby="resume-hint"
            >
              {resumeFileName ? "Replace file" : "Choose file"}
            </Button>
          </div>
          <input
            ref={fileInput}
            id="resume"
            type="file"
            accept={RESUME_ACCEPT}
            className="sr-only"
            aria-invalid={Boolean(resumeError)}
            aria-describedby={
              resumeError ? "resumeFileName-error resume-hint" : "resume-hint"
            }
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
          <p id="resume-hint" className="font-onest text-sm text-muted-text">
            PDF, DOC or DOCX, up to 5 MB.
          </p>
          <FieldError id="resumeFileName" message={resumeError} />
        </div>
      </div>

      <StepActions onBack={onBack} />
    </form>
  );
}
