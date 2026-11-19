import Image from "next/image";
import { cn } from "@/lib/utils";
import { ICONS } from "../constants";
import { getPageTokens } from "../utils";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const box =
  "flex size-10 items-center justify-center rounded-[4px] border font-sans text-[16px] leading-[1.5] font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40";

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className={cn(
        box,
        "p-3",
        disabled
          ? "cursor-not-allowed border-[#8e938f]"
          : "cursor-pointer border-brand-800 hover:bg-brand-50",
      )}
    >
      <Image
        src={disabled ? ICONS.chevronLeft : ICONS.chevronLeftActive}
        width={18}
        height={18}
        alt=""
        className={direction === "next" ? "rotate-180" : undefined}
      />
    </button>
  );
}

/** Figma pagination: 40px boxes, active #0b4a47 filled, others outlined. */
export function ApplicationsPagination({
  page,
  pageCount,
  onPageChange,
}: Props) {
  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <Arrow
            direction="prev"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
        </li>
        {getPageTokens(page, pageCount).map((token) =>
          typeof token === "number" ? (
            <li key={token}>
              <button
                type="button"
                onClick={() => onPageChange(token)}
                aria-current={token === page ? "page" : undefined}
                aria-label={`Page ${token}`}
                className={cn(
                  box,
                  "cursor-pointer p-2",
                  token === page
                    ? "border-brand-800 bg-brand-800 text-[#f8f9fa]"
                    : "border-brand-800 text-[#68706a] hover:bg-brand-50",
                )}
              >
                {token}
              </button>
            </li>
          ) : (
            <li key={token} aria-hidden="true">
              <span className={cn(box, "border-brand-800 p-2 text-[#68706a]")}>
                ...
              </span>
            </li>
          ),
        )}
        <li>
          <Arrow
            direction="next"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          />
        </li>
      </ul>
    </nav>
  );
}
