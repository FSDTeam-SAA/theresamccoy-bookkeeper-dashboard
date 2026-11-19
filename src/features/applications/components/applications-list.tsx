"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ICONS,
  PAGE_SIZE,
  RESUME_PREVIEW_UNAVAILABLE,
  STATUS_OPTIONS,
} from "../constants";
import type {
  ApplicationFilters,
  ApplicationStatus,
  BookkeeperApplication,
} from "../types";
import {
  collectSpecializations,
  filterApplications,
  formatSubmittedDate,
} from "../utils";
import { ApplicationsPagination } from "./applications-pagination";
import { ApplyButton } from "./apply-button";
import { StatusPill } from "./status-pill";

const fieldBox =
  "w-full rounded-[6px] border border-[#b5bec0] bg-transparent p-4 font-onest text-[16px] leading-[1.2] font-light text-ink outline-none placeholder:text-[#b5bec0] focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-400/30";

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full md:w-[260px] md:shrink-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          fieldBox,
          "cursor-pointer appearance-none pr-12",
          value === "all" && "text-[#b5bec0]",
        )}
      >
        {children}
      </select>
      <Image
        src={ICONS.chevronDown}
        width={24}
        height={24}
        alt=""
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
      />
    </div>
  );
}

const th =
  "h-11 bg-brand-50 px-6 py-3 font-onest text-[12px] leading-[1.2] font-light whitespace-nowrap text-ink";
const td =
  "h-[72px] border-b border-[#e6e7e6] px-6 py-4 text-center font-onest text-[16px] leading-[1.2] font-light whitespace-nowrap text-muted-text";

/** Figma 11525:19480 — submitted applications with search, filters, paging. */
export function ApplicationsList({
  applications,
}: {
  applications: BookkeeperApplication[];
}) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    query: "",
    status: "all",
    specialization: "all",
  });
  const [page, setPage] = useState(1);

  const specializationOptions = useMemo(
    () => collectSpecializations(applications),
    [applications],
  );
  const filtered = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const updateFilters = (patch: Partial<ApplicationFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  return (
    <section
      aria-labelledby="applications-title"
      className="flex min-w-0 flex-col gap-6 px-4 py-6 sm:px-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h1
            id="applications-title"
            className="font-onest text-[24px] leading-[1.2] font-medium text-brand-900"
          >
            Applications
          </h1>
          <p className="font-onest text-[16px] leading-[1.2] font-light text-muted-text">
            Manage and review all bookkeeper applications submitted on the
            platform.
          </p>
        </div>
        <ApplyButton />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="applications-search" className="sr-only">
            Search applications
          </label>
          <input
            id="applications-search"
            type="search"
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            placeholder="Search by title, specialization or application ID ..."
            className={cn(fieldBox, "pr-12")}
          />
          <Image
            src={ICONS.search}
            width={24}
            height={24}
            alt=""
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
          />
        </div>
        <FilterSelect
          id="applications-status"
          label="Filter by status"
          value={filters.status}
          onChange={(value) =>
            updateFilters({ status: value as ApplicationStatus | "all" })
          }
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          id="applications-specialization"
          label="Filter by specialization"
          value={filters.specialization}
          onChange={(value) => updateFilters({ specialization: value })}
        >
          <option value="all">All Specialization</option>
          {specializationOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
      </div>

      <div className="overflow-x-auto rounded-[12px] border border-[#e6e7e6] bg-white">
        <table className="w-full min-w-[1040px] border-collapse">
          <caption className="sr-only">Your bookkeeper applications</caption>
          <thead>
            <tr>
              <th scope="col" className={cn(th, "text-left")}>
                Application ID
              </th>
              <th scope="col" className={th}>
                Submitted Date
              </th>
              <th scope="col" className={th}>
                Professional Title
              </th>
              <th scope="col" className={th}>
                Experience
              </th>
              <th scope="col" className={cn(th, "w-[255px]")}>
                Specialization
              </th>
              <th scope="col" className={th}>
                Resume
              </th>
              <th scope="col" className={th}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={cn(td, "border-b-0")}>
                  No applications match your search.
                </td>
              </tr>
            ) : (
              rows.map((app, index) => {
                const last = index === rows.length - 1;
                const cell = cn(td, last && "border-b-0");
                return (
                  <tr key={app.id}>
                    <td
                      className={cn(
                        cell,
                        "text-left font-normal text-[#102a2b]",
                      )}
                    >
                      {app.id}
                    </td>
                    <td className={cell}>
                      {formatSubmittedDate(app.submittedAt)}
                    </td>
                    <td className={cell}>{app.professionalTitle}</td>
                    <td className={cell}>{app.experience}</td>
                    <td className={cell}>
                      {app.specializations.join(", ") || "—"}
                    </td>
                    <td className={cell}>
                      <span
                        className="inline-flex"
                        title={
                          app.resumeFileName
                            ? RESUME_PREVIEW_UNAVAILABLE
                            : "No resume uploaded"
                        }
                      >
                        <button
                          type="button"
                          disabled
                          aria-label={`View resume for ${app.id}`}
                          className="flex h-10 w-[78px] cursor-not-allowed items-center justify-center rounded-[4px] border border-[#f2f2f2] bg-[rgba(211,211,211,0.1)] p-4 font-onest text-[16px] leading-[1.2] font-normal text-[#a8a8a8]"
                        >
                          View
                        </button>
                      </span>
                    </td>
                    <td className={cell}>
                      <StatusPill status={app.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pt-0">
        <p
          className="font-sans text-[16px] leading-[1.5] text-[#68706a]"
          aria-live="polite"
        >
          {filtered.length === 0
            ? "Showing 0 results"
            : `Showing ${start + 1} to ${start + rows.length} of ${filtered.length} results`}
        </p>
        {pageCount > 1 ? (
          <ApplicationsPagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </section>
  );
}
