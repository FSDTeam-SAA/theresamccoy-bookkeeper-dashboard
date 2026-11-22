import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ContractDetail } from "@/features/interviews/components/contract-detail";
import {
  CONTRACT_DETAIL_SUBTITLE,
  CONTRACT_REQUESTS,
  findContract,
} from "@/features/interviews/constants";

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CONTRACT_REQUESTS.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const contract = findContract(id);
  return {
    title: `${contract?.detail.title ?? "Contract"} | Bookkeeper Dashboard`,
  };
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const contract = findContract(id);
  if (!contract) notFound();

  return (
    <>
      <DashboardHeader
        title={contract.detail.title}
        subtitle={CONTRACT_DETAIL_SUBTITLE}
      />
      <ContractDetail id={id} />
    </>
  );
}
