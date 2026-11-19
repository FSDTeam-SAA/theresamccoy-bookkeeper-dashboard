import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AssessmentPage } from "@/features/assessments/components/assessment-page";
import {
  APPLICATION_SUBTITLE,
  ASSESSMENTS,
  findAssessment,
} from "@/features/assessments/constants";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return ASSESSMENTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const assessment = findAssessment(slug);
  return {
    title: `${assessment?.title ?? "Assessment"} | Bookkeeper Dashboard`,
  };
}

export default async function AssessmentRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!findAssessment(slug)) notFound();

  return (
    <>
      <DashboardHeader title="Assessments" subtitle={APPLICATION_SUBTITLE} />
      <AssessmentPage slug={slug} />
    </>
  );
}
