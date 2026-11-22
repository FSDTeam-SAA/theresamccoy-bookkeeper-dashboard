import type { Review } from "./types";

/**
 * Copy transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk,
 * node 11438:17611). Static until the reviews endpoint exists.
 */

export const REVIEWS_TITLE = "Reviews";
export const REVIEWS_SUBTITLE = "See reviews of the projects you have done";

/** Figma's 5-star strip (4 filled + 1 outlined), 96×16. */
export const RATING_STARS_ICON = "/images/reviews/rating-stars.svg";

const QUOTE =
  '"Sarah reconciled our Shopify and Amazon accounts seamlessly. Our BAS has never been cleaner. We renewed for a third consecutive year."';

// Figma repeats one placeholder review four times; kept as designed.
export const REVIEWS: readonly Review[] = [1, 2, 3, 4].map((n) => ({
  id: `review-${n}`,
  rating: 4.9,
  date: "March 2025",
  quote: QUOTE,
  project: "E-commerce Bookkeeping Setup",
}));
