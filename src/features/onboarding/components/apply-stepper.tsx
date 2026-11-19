"use client";

import { Fragment } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { APPLY_STEPS } from "../constants";

type Status = "complete" | "current" | "upcoming";

function StepMarker({ index, status }: { index: number; status: Status }) {
  const src =
    status === "complete"
      ? "/images/apply/step-complete.svg"
      : status === "current"
        ? "/images/apply/step-active.svg"
        : "/images/apply/step-upcoming.svg";
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center sm:size-16">
      <Image src={src} alt="" fill sizes="64px" aria-hidden="true" />
      {status !== "complete" && (
        <span
          aria-hidden="true"
          className={cn(
            "relative font-onest text-base leading-[1.5] font-semibold sm:text-2xl",
            status === "current" ? "text-mist" : "text-ink-400",
          )}
        >
          {index + 1}
        </span>
      )}
    </span>
  );
}

export function ApplyStepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Application progress" className="w-full">
      <ol className="mx-auto flex w-full max-w-[1245px] items-center gap-2 lg:gap-6">
        {APPLY_STEPS.map((step, index) => {
          const status: Status =
            index < current
              ? "complete"
              : index === current
                ? "current"
                : "upcoming";
          const label = (
            <span
              aria-hidden="true"
              className={cn(
                "hidden text-center font-onest text-base leading-[1.5] sm:block",
                status === "complete" && "font-semibold text-ink",
                status === "current" && "font-semibold text-brand-900",
                status === "upcoming" && "font-normal text-[#b5bdbd]",
              )}
            >
              {step.label}
            </span>
          );
          const srStatus =
            status === "complete"
              ? ", completed"
              : status === "current"
                ? ", current step"
                : "";
          return (
            <Fragment key={step.key}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="relative h-0.5 min-w-3 flex-1 sm:-mt-8"
                >
                  <Image
                    src="/images/apply/step-connector.svg"
                    alt=""
                    width={142}
                    height={2}
                    className="absolute inset-0 h-0.5 w-full"
                  />
                </li>
              )}
              <li
                className="flex shrink-0 flex-col items-center sm:w-[99px]"
                aria-current={status === "current" ? "step" : undefined}
              >
                {status === "complete" ? (
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <StepMarker index={index} status={status} />
                    {label}
                    <span className="sr-only">
                      {`Step ${index + 1}: ${step.label}${srStatus}. Go back to this step`}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <StepMarker index={index} status={status} />
                    {label}
                    <span className="sr-only">
                      {`Step ${index + 1}: ${step.label}${srStatus}`}
                    </span>
                  </div>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
