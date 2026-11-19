"use client";

/* eslint-disable @next/next/no-img-element -- fixed-size Figma SVG assets */
import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { submitAssessment } from "../api/submit-assessment.api";
import { SUBMISSIONS_HREF } from "../constants";
import { downloadAssessmentPdf } from "../lib/export-pdf";
import { useAssessmentsStore } from "../store";
import type { Answers, AssessmentContent, CandidateField } from "../types";
import { answerableQuestions, unansweredQuestions } from "../utils";
import { QuestionBlock } from "./question-parts";

const EMPTY_ANSWERS: Answers = {};

const docGutter = "px-4 sm:px-10 lg:px-[100px]";
const fieldLabel = "text-[16px] leading-[1.2] font-normal text-[#102a2b]";
const fieldInput =
  "w-full rounded-[8px] border p-4 font-onest text-[16px] leading-[1.2] text-ink outline-none placeholder:font-light placeholder:text-muted-text focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-400/30";

function LabeledInput({
  field,
  value,
  onChange,
  inputClassName,
  className,
}: {
  field: CandidateField;
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <label htmlFor={id} className={fieldLabel}>
        {field.label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldInput, inputClassName)}
      />
    </div>
  );
}

/** Bookkeeping Skills Assessment document (Figma 11807:10014). */
export function AssessmentForm({
  slug,
  content,
}: {
  slug: string;
  content: AssessmentContent;
}) {
  const router = useRouter();
  const answers = useAssessmentsStore((state) => state.drafts[slug] ?? EMPTY_ANSWERS);
  const setAnswer = useAssessmentsStore((state) => state.setAnswer);
  const markCompleted = useAssessmentsStore((state) => state.markCompleted);
  const clearDraft = useAssessmentsStore((state) => state.clearDraft);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onAnswer = (fieldId: string, value: string) => setAnswer(slug, fieldId, value);
  const unansweredCount = unansweredQuestions(content, answers).length;
  const total = answerableQuestions(content).length;

  const submit = async () => {
    setSubmitting(true);
    try {
      const result = await submitAssessment({ slug, answers });
      markCompleted(slug, result.submittedAt);
      clearDraft(slug);
      setConfirmOpen(false);
      toast.success("Assessment submitted", {
        description: "Next, submit your application to become a bookkeeper.",
      });
      router.push(SUBMISSIONS_HREF);
    } catch {
      toast.error("We couldn't submit your assessment. Please try again.");
      setSubmitting(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (unansweredCount > 0) setConfirmOpen(true);
    else void submit();
  };

  const onDownload = async () => {
    try {
      await downloadAssessmentPdf(content, answers);
    } catch {
      toast.error("We couldn't create the PDF. Please try again.");
    }
  };

  const { acknowledgment } = content;

  return (
    <div className="px-0 py-6 sm:px-6 sm:py-[38px]">
      <form
        onSubmit={onSubmit}
        aria-labelledby="assessment-title"
        className="mx-auto flex w-full max-w-[1000px] flex-col font-onest"
        noValidate
      >
        <div className={cn("flex flex-col gap-3 bg-brand-900 py-10 text-center leading-[1.2]", docGutter)}>
          <h2 id="assessment-title" className="text-[26px] font-semibold text-mist sm:text-[32px]">
            {content.title}
          </h2>
          <p className="text-[16px] font-light text-brand-50 sm:text-[20px]">{content.subtitle}</p>
        </div>

        <p className={cn("bg-brand-50 py-5 text-[14px] leading-[1.2] text-brand-800", docGutter)}>
          <span className="font-medium">{content.instructionsLead}</span>{" "}
          <span className="font-light">{content.instructions}</span>
        </p>

        <div className={cn("flex flex-col gap-10 py-10", docGutter)}>
          <div className="flex flex-col gap-4 rounded-[12px] border border-[#e6e7e6] bg-brand-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
              {content.candidateFields.map((field) => (
                <LabeledInput
                  key={field.id}
                  field={field}
                  value={answers[field.id] ?? ""}
                  onChange={(value) => onAnswer(field.id, value)}
                  inputClassName="h-[51px] border-[#d7d7d7] bg-transparent"
                />
              ))}
              <p className="flex gap-2 text-[16px] leading-[1.2]">
                <span className="font-normal text-[#102a2b]">{content.candidateStatic.label}</span>
                <span className="font-light text-muted-text">{content.candidateStatic.value}</span>
              </p>
            </div>
          </div>

          {content.sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`${section.id}-title`}
              className="flex flex-col gap-6"
            >
              <h2
                id={`${section.id}-title`}
                className="text-[20px] leading-[1.2] font-semibold text-brand-800"
              >
                {section.title}
              </h2>
              <img
                src="/images/assessments/section-divider.svg"
                alt=""
                width={800}
                height={1}
                className="block h-px w-full"
              />
              {section.questions.map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  answers={answers}
                  onAnswer={onAnswer}
                />
              ))}
            </section>
          ))}

          <section
            aria-labelledby="acknowledgment-title"
            className="-mt-4 flex flex-col gap-4 rounded-[8px] border border-[#e6e7e6] bg-brand-50 p-5"
          >
            <div className="flex flex-col gap-2 leading-[1.2]">
              <h2 id="acknowledgment-title" className="text-[20px] font-semibold text-brand-800">
                {acknowledgment.title}
              </h2>
              <p className="text-[16px] font-light text-[#102a2b]">{acknowledgment.text}</p>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row">
              <LabeledInput
                field={acknowledgment.signature}
                value={answers[acknowledgment.signature.id] ?? ""}
                onChange={(value) => onAnswer(acknowledgment.signature.id, value)}
                inputClassName="border-[#e6e7e6] bg-mist"
                className="flex-1"
              />
              <LabeledInput
                field={acknowledgment.date}
                value={answers[acknowledgment.date.id] ?? ""}
                onChange={(value) => onAnswer(acknowledgment.date.id, value)}
                inputClassName="border-[#e6e7e6] bg-mist"
                className="sm:w-[160px]"
              />
            </div>
          </section>

          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                type="submit"
                variant="brand"
                disabled={submitting}
                className="h-[51px] rounded-[6px] px-8 text-[16px] leading-[1.2] font-normal text-white"
              >
                {submitting ? "Submitting…" : content.submitLabel}
              </Button>
              <Button
                type="button"
                variant="brand-outline"
                onClick={onDownload}
                className="h-[52px] gap-[10px] rounded-[6px] border-brand-800 px-8 text-[16px] leading-[1.2] font-normal text-brand-800"
              >
                <img src="/images/assessments/download.svg" alt="" width={24} height={24} />
                {content.downloadLabel}
              </Button>
            </div>
            <p className="text-center text-[12px] leading-[1.2] font-light text-[#6b7e92]">
              {content.footer}
            </p>
          </div>
        </div>
      </form>

      <Dialog open={confirmOpen} onOpenChange={(open) => !submitting && setConfirmOpen(open)}>
        <DialogContent className="font-onest sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-brand-900">
              Submit with unanswered questions?
            </DialogTitle>
            <DialogDescription className="text-[16px] font-light text-muted-text">
              {unansweredCount} of {total} questions{" "}
              {unansweredCount === 1 ? "has" : "have"} no answer yet. You can keep working
              or submit the assessment as it is.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="brand-outline"
              className="h-11 rounded-[6px] px-6 text-[16px]"
              onClick={() => setConfirmOpen(false)}
              disabled={submitting}
            >
              Keep Working
            </Button>
            <Button
              type="button"
              variant="brand"
              className="h-11 rounded-[6px] px-6 text-[16px]"
              onClick={() => void submit()}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
