"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ApplicationsPagination } from "@/features/applications/components/applications-pagination";
import { cn } from "@/lib/utils";
import {
  ENGAGEMENTS,
  ENGAGEMENTS_PAGE_SIZE,
  ENGAGEMENT_SECTION_DESCRIPTION,
  ENGAGEMENT_SECTION_TITLE,
  ENGAGEMENT_STATUS_STYLES,
  SIGN_COMING_SOON,
} from "../constants";
import type { Engagement } from "../types";

const COLUMNS = [
  "Engagement ID",
  "Bookkeeper",
  "Project / Work",
  "Contract Date",
  "Contract Period",
  "Contract Value",
  "Status",
] as const;

const pill =
  "inline-flex items-center justify-center rounded-[4px] p-2 text-[14px] leading-[1.2] font-medium whitespace-nowrap";
const cell =
  "h-[72px] px-6 py-4 text-center text-[16px] leading-[1.2] font-light whitespace-nowrap text-muted-text";

function StatusCell({ engagement }: { engagement: Engagement }) {
  const className = cn(pill, ENGAGEMENT_STATUS_STYLES[engagement.status]);

  // "Sign" is the bookkeeper's call to action on a contract awaiting them.
  if (engagement.status === "Sign") {
    return (
      <button
        type="button"
        onClick={() => toast.info(SIGN_COMING_SOON)}
        aria-label={`Sign contract ${engagement.id}`}
        className={cn(
          className,
          "cursor-pointer outline-none hover:bg-[rgba(96,157,207,0.2)] focus-visible:ring-[3px] focus-visible:ring-brand-400/40",
        )}
      >
        Sign
      </button>
    );
  }
  return <span className={className}>{engagement.status}</span>;
}

/** Contracts table (Figma 11572:5287). */
export function EngagementTable() {
  const [page, setPage] = useState(1);
  const total = ENGAGEMENTS.length;
  const pageCount = Math.max(1, Math.ceil(total / ENGAGEMENTS_PAGE_SIZE));
  const start = (page - 1) * ENGAGEMENTS_PAGE_SIZE;
  const rows = ENGAGEMENTS.slice(start, start + ENGAGEMENTS_PAGE_SIZE);
  const first = total === 0 ? 0 : start + 1;
  const last = start + rows.length;

  return (
    <section
      aria-labelledby="engagement-section-title"
      className="flex flex-col gap-6 px-4 py-6 sm:px-6"
    >
      <div className="flex flex-col gap-2 leading-[1.2]">
        <h2
          id="engagement-section-title"
          className="text-[24px] font-medium text-brand-900"
        >
          {ENGAGEMENT_SECTION_TITLE}
        </h2>
        <p className="text-[16px] font-light text-muted-text">
          {ENGAGEMENT_SECTION_DESCRIPTION}
        </p>
      </div>

      <div className="overflow-x-auto rounded-[12px] border border-[#e6e7e6] bg-white">
        <table className="w-full min-w-[960px] border-collapse">
          <caption className="sr-only">Contracts</caption>
          <thead>
            <tr className="bg-brand-50">
              {COLUMNS.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    "h-11 px-6 py-3 text-[12px] leading-[1.2] font-light whitespace-nowrap text-ink",
                    index === 0 ? "text-left" : "text-center",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((engagement) => (
              <tr
                key={engagement.id}
                className="border-b border-[#e6e7e6] last:border-b-0"
              >
                <th
                  scope="row"
                  className="h-[72px] px-6 py-4 text-left text-[16px] leading-[1.2] font-normal whitespace-nowrap text-[#102a2b]"
                >
                  {engagement.id}
                </th>
                <td className={cell}>{engagement.bookkeeper}</td>
                <td className={cell}>{engagement.project}</td>
                <td className={cell}>{engagement.contractDate}</td>
                <td className={cell}>{engagement.contractPeriod}</td>
                <td className={cell}>{engagement.contractValue}</td>
                <td className={cell}>
                  <StatusCell engagement={engagement} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p
          aria-live="polite"
          className="font-sans text-[16px] leading-[1.5] text-[#68706a]"
        >
          Showing {first} to {last} of {total} results
        </p>
        <ApplicationsPagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
