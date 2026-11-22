"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTRACT_REQUESTS, contractHref } from "../constants";
import { useRequestsHydrated } from "../hooks/use-requests-hydrated";
import { useRequestsStore } from "../store";
import type { ContractRequest } from "../types";
import {
  CountBadge,
  RequestCard,
  RequestsTabs,
  StatusBadge,
  primaryAction,
} from "./request-ui";

function ContractActions({ contract }: { contract: ContractRequest }) {
  const hydrated = useRequestsHydrated();
  const decision = useRequestsStore((state) => state.contracts[contract.id]);
  const href = contractHref(contract.id);

  return (
    <>
      <Button
        asChild
        variant="brand"
        className={cn(primaryAction, "text-mist")}
      >
        <Link href={href} aria-label={`View contract: ${contract.project}`}>
          View
        </Link>
      </Button>
      {hydrated && decision ? (
        <StatusBadge
          tone={decision.status === "signed" ? "success" : "danger"}
          className="min-h-11 text-[14px]"
        >
          {decision.status === "signed" ? "Signed" : "Declined"}
        </StatusBadge>
      ) : (
        <Button
          asChild
          variant="brand-outline"
          className={cn(primaryAction, "border-brand-800 text-brand-800")}
        >
          <Link
            href={`${href}#sign`}
            aria-label={`Sign contract: ${contract.project}`}
          >
            Sign
          </Link>
        </Button>
      )}
    </>
  );
}

/** Requests → Contract Signing tab (Figma 11574:13071). */
export function ContractRequests() {
  const hydrated = useRequestsHydrated();
  const decisions = useRequestsStore((state) => state.contracts);
  const pending = CONTRACT_REQUESTS.filter(
    (contract) => !hydrated || !decisions[contract.id],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6">
      <RequestsTabs active="contracts" />
      <section
        aria-labelledby="contract-requests"
        className="flex flex-col gap-4"
      >
        <div className="flex items-end gap-2">
          <h2
            id="contract-requests"
            className="text-[22px] leading-[1.2] font-medium text-ink sm:text-[24px]"
          >
            Contract Requests
          </h2>
          <CountBadge
            count={pending.length}
            label="contracts awaiting signature"
          />
        </div>
        <ul className="flex flex-col gap-6">
          {CONTRACT_REQUESTS.map((contract) => (
            <RequestCard
              key={contract.id}
              request={contract}
              actions={<ContractActions contract={contract} />}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
