export type Review = {
  id: string;
  /** Average client rating out of 5. */
  rating: number;
  /** Display date, e.g. "March 2025". */
  date: string;
  quote: string;
  project: string;
};
