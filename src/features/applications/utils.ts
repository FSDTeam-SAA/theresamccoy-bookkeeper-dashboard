import type {
  ApplicationFilters,
  BookkeeperApplication,
  PageToken,
} from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/** "Aug 08, 2026" */
export function formatSubmittedDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

/** "6 Years", "1 Year", "5.5 Years" */
export function formatExperience(years: string) {
  const n = Number(years);
  return `${n} ${n === 1 ? "Year" : "Years"}`;
}

export function filterApplications(
  applications: BookkeeperApplication[],
  { query, status, specialization }: ApplicationFilters,
) {
  const needle = query.trim().toLowerCase();
  return applications.filter((app) => {
    if (status !== "all" && app.status !== status) return false;
    if (
      specialization !== "all" &&
      !app.specializations.includes(specialization)
    ) {
      return false;
    }
    if (!needle) return true;
    return [app.id, app.professionalTitle, ...app.specializations].some(
      (field) => field.toLowerCase().includes(needle),
    );
  });
}

export function collectSpecializations(applications: BookkeeperApplication[]) {
  return Array.from(
    new Set(applications.flatMap((app) => app.specializations)),
  ).sort((a, b) => a.localeCompare(b));
}

/** Page buttons with ellipses, e.g. page 1 of 8 → 1 2 3 … 8. */
export function getPageTokens(current: number, total: number): PageToken[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2].forEach((p) => pages.add(p));
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const tokens: PageToken[] = [];
  sorted.forEach((page, index) => {
    const prev = sorted[index - 1];
    if (prev !== undefined && page - prev === 2) tokens.push(prev + 1);
    else if (prev !== undefined && page - prev > 2) {
      tokens.push(page === total ? "ellipsis-end" : "ellipsis-start");
    }
    tokens.push(page);
  });
  return tokens;
}
