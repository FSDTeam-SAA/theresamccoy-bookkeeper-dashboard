import Image from "next/image";
import { RATING_STARS_ICON, REVIEWS } from "../constants";
import type { Review } from "../types";

function ReviewCard({ review }: { review: Review }) {
  const projectId = `${review.id}-project`;

  return (
    <li>
      <article
        aria-labelledby={projectId}
        className="flex h-full flex-col gap-6 rounded-[8px] bg-white px-4 py-4 drop-shadow-[4px_6px_4px_rgba(0,0,0,0.12)] sm:px-8 lg:min-h-[234px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-[11px]">
              <span
                aria-hidden="true"
                className="text-[28px] leading-[1.2] font-semibold text-[#1e1e1e] sm:text-[32px]"
              >
                {review.rating.toFixed(1)}
              </span>
              <Image src={RATING_STARS_ICON} width={96} height={16} alt="" />
              <span className="sr-only">
                Rated {review.rating.toFixed(1)} out of 5 stars
              </span>
            </p>
            <p className="text-[16px] leading-[1.2] font-light text-[#6a6a6a]">
              {review.date}
            </p>
          </div>
          <blockquote className="text-[16px] leading-[1.5] text-ink sm:text-[18px]">
            {review.quote}
          </blockquote>
        </div>

        <div className="mt-auto flex flex-col gap-1">
          <p className="text-[16px] leading-[1.2] text-[#6a6a6a]">Project :</p>
          <h2
            id={projectId}
            className="text-[18px] leading-[1.2] font-semibold text-ink"
          >
            {review.project}
          </h2>
        </div>
      </article>
    </li>
  );
}

/** Reviews grid (Figma 11438:17611): two columns from lg, stacked below. */
export function ReviewsList() {
  if (!REVIEWS.length) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <p
          role="status"
          className="rounded-[8px] bg-white p-6 text-[16px] leading-[1.5] text-[#6a6a6a]"
        >
          You don’t have any reviews yet. They’ll appear here once clients rate
          your completed projects.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-7">
      <ul
        aria-label="Client reviews"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ul>
    </div>
  );
}
