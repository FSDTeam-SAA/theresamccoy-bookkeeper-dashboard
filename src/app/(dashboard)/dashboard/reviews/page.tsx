import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ReviewsList } from "@/features/reviews/components/reviews-list";
import { REVIEWS_SUBTITLE, REVIEWS_TITLE } from "@/features/reviews/constants";

export const metadata: Metadata = {
  title: "Reviews | Bookkeeper Dashboard",
};

export default function ReviewsPage() {
  return (
    <>
      <DashboardHeader title={REVIEWS_TITLE} subtitle={REVIEWS_SUBTITLE} />
      <ReviewsList />
    </>
  );
}
