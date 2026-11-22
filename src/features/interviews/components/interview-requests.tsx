"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INTERVIEW_REQUESTS } from "../constants";
import { useRequestsHydrated } from "../hooks/use-requests-hydrated";
import { useRequestsStore } from "../store";
import type { InterviewRequest } from "../types";
import {
  ConfirmDialog,
  CountBadge,
  RequestCard,
  RequestsTabs,
  StatusBadge,
  dangerOutline,
  primaryAction,
} from "./request-ui";

function InterviewActions({ request }: { request: InterviewRequest }) {
  const hydrated = useRequestsHydrated();
  const decision = useRequestsStore((state) => state.interviews[request.id]);
  const decide = useRequestsStore((state) => state.decideInterview);
  const undo = useRequestsStore((state) => state.undoInterview);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (hydrated && decision) {
    return (
      <div className="flex flex-col items-start gap-3 md:items-stretch">
        <StatusBadge
          tone={decision === "accepted" ? "success" : "danger"}
          className="py-2 text-[14px]"
        >
          {decision === "accepted"
            ? "Interview accepted"
            : "Interview rejected"}
        </StatusBadge>
        <Button
          type="button"
          variant="brand-outline"
          onClick={() => undo(request.id)}
          className={primaryAction}
        >
          Undo
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="brand"
        onClick={() => {
          decide(request.id, "accepted");
          toast.success("Interview accepted", {
            description: `${request.company} will be notified.`,
          });
        }}
        className={cn(primaryAction, "text-mist")}
      >
        Accept Interview
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setConfirmOpen(true)}
        className={cn(primaryAction, "shadow-none", dangerOutline)}
      >
        Reject
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Reject this interview?"
        description={`${request.company} will be told you're not available for “${request.project}”.`}
        confirmLabel="Reject interview"
        onConfirm={() => {
          decide(request.id, "declined");
          setConfirmOpen(false);
          toast("Interview rejected");
        }}
      />
    </>
  );
}

/** Requests → Interview tab (Figma 11574:12992). */
export function InterviewRequests() {
  const hydrated = useRequestsHydrated();
  const decisions = useRequestsStore((state) => state.interviews);
  const pending = INTERVIEW_REQUESTS.filter(
    (request) => !hydrated || !decisions[request.id],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6">
      <RequestsTabs active="interview" />
      <section
        aria-labelledby="interview-requests"
        className="flex flex-col gap-4"
      >
        <div className="flex items-end gap-2">
          <h2
            id="interview-requests"
            className="text-[22px] leading-[1.2] font-medium text-ink sm:text-[24px]"
          >
            Interview Requests
          </h2>
          <CountBadge
            count={pending.length}
            label="pending interview requests"
          />
        </div>
        <ul className="flex flex-col gap-6">
          {INTERVIEW_REQUESTS.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              actions={<InterviewActions request={request} />}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
