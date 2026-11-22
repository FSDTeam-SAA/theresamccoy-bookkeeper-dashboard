"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONTRACTS_HREF,
  ICONS,
  PROJECT_FILE_ACCEPT,
  SIGNATURE_ACCEPT,
  findContract,
} from "../constants";
import { useRequestsHydrated } from "../hooks/use-requests-hydrated";
import { useRequestsStore } from "../store";
import type { ScopeStatus } from "../types";
import {
  BackLink,
  ConfirmDialog,
  DetailRows,
  StatusBadge,
  type StatusBadgeTone,
  dangerOutline,
  notifyComingSoon,
  validateUpload,
} from "./request-ui";

const card = "flex flex-col gap-5 rounded-[12px] bg-white p-4 sm:p-5";
const cardTitle =
  "text-[22px] leading-[1.2] font-medium text-ink sm:text-[24px]";

const scopeBadge: Record<
  ScopeStatus,
  { tone: StatusBadgeTone; label: string }
> = {
  complete: { tone: "success", label: "Complete" },
  "in-progress": { tone: "warning", label: "In Progress" },
  pending: { tone: "neutral", label: "Pending" },
};

/** Hidden native file input driven by a visible button. */
function useFilePicker(accept: string, onPick: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      tabIndex={-1}
      aria-hidden="true"
      className="sr-only"
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) onPick(file);
      }}
    />
  );
  return { input, open: () => inputRef.current?.click() };
}

function ProjectFiles({
  contractId,
  files,
}: {
  contractId: string;
  files: { id: string; name: string }[];
}) {
  const hydrated = useRequestsHydrated();
  const uploaded = useRequestsStore((state) => state.projectFiles[contractId]);
  const addFile = useRequestsStore((state) => state.addProjectFile);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  const picker = useFilePicker(PROJECT_FILE_ACCEPT, (file) => {
    const problem = validateUpload(file, PROJECT_FILE_ACCEPT);
    setError(problem);
    if (problem) return;
    addFile(contractId, file.name);
    toast.success("File added", { description: file.name });
  });

  const allFiles = [
    ...files,
    ...(hydrated ? (uploaded ?? []) : []).map((name, index) => ({
      id: `uploaded-${index}`,
      name,
    })),
  ];

  return (
    <section aria-labelledby="project-files" className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="project-files" className={cardTitle}>
          Project Files
        </h2>
        {picker.input}
        <Button
          type="button"
          variant="brand"
          onClick={picker.open}
          aria-describedby={error ? errorId : undefined}
          className="h-auto min-h-9 gap-1 rounded-[4px] px-4 py-2 text-[12px] leading-[1.2] font-light"
        >
          <Image src={ICONS.upload} width={14} height={14} alt="" />
          Upload File
        </Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-[14px] text-[#b91c1c]">
          {error}
        </p>
      ) : null}
      <ul className="flex flex-col">
        {allFiles.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between gap-4 border-b border-[#f2f2f2] py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <span className="flex min-w-0 items-center gap-1">
              <Image
                src={ICONS.file}
                width={20}
                height={20}
                alt=""
                className="shrink-0"
              />
              <span className="truncate text-[16px] leading-[1.2] text-ink-400 sm:text-[18px]">
                {file.name}
              </span>
            </span>
            <button
              type="button"
              onClick={() => notifyComingSoon("File downloads")}
              aria-label={`Download ${file.name}`}
              className="shrink-0 rounded px-1 text-[12px] leading-[1.2] font-light text-muted-text hover:text-brand-900 focus-visible:ring-[3px] focus-visible:ring-brand-400/40 focus-visible:outline-none"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Timeline({ items }: { items: { date: string; label: string }[] }) {
  return (
    <section aria-labelledby="timeline" className={card}>
      <h2 id="timeline" className={cardTitle}>
        Timeline
      </h2>
      <ol className="flex flex-col">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.date} className="flex gap-3">
              <div
                aria-hidden="true"
                className="flex shrink-0 flex-col items-center"
              >
                <Image src={ICONS.timelineDot} width={19} height={19} alt="" />
                {last ? null : (
                  <span className="-my-[5px] w-[3px] flex-1 bg-[#b5bec0]" />
                )}
              </div>
              <div
                className={cn(
                  "flex flex-col gap-2 leading-[1.2]",
                  !last && "pb-3",
                )}
              >
                <p className="text-[16px] font-light text-[#6a6a6a]">
                  {item.date}
                </p>
                <p className="text-[18px] text-ink sm:text-[20px]">
                  {item.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SignatureActions({
  contractId,
  client,
}: {
  contractId: string;
  client: string;
}) {
  const router = useRouter();
  const hydrated = useRequestsHydrated();
  const decision = useRequestsStore((state) => state.contracts[contractId]);
  const sign = useRequestsStore((state) => state.signContract);
  const decline = useRequestsStore((state) => state.declineContract);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signRef = useRef<HTMLButtonElement>(null);
  const errorId = useId();

  const picker = useFilePicker(SIGNATURE_ACCEPT, (file) => {
    const problem = validateUpload(file, SIGNATURE_ACCEPT);
    setError(problem);
    if (problem) return;
    sign(contractId, file.name);
    toast.success("Contract accepted", {
      description: `Signature “${file.name}” sent to ${client}.`,
    });
  });

  // "Sign" on the list links to #sign — bring the signature action into focus.
  useEffect(() => {
    if (window.location.hash === "#sign") signRef.current?.focus();
  }, []);

  if (hydrated && decision) {
    return (
      <div id="sign" className="flex flex-col items-end gap-2 text-right">
        <StatusBadge
          tone={decision.status === "signed" ? "success" : "danger"}
          className="py-2 text-[14px]"
        >
          {decision.status === "signed"
            ? `Signed · ${decision.signatureFile}`
            : "Contract declined"}
        </StatusBadge>
      </div>
    );
  }

  return (
    <div id="sign" className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmOpen(true)}
          className={cn(
            "h-[50px] rounded-[8px] px-6 text-[14px] font-light shadow-none sm:w-[156px]",
            dangerOutline,
          )}
        >
          Decline
        </Button>
        {picker.input}
        <Button
          ref={signRef}
          type="button"
          variant="brand"
          onClick={picker.open}
          aria-describedby={error ? errorId : undefined}
          className="h-[50px] gap-1 rounded-[8px] px-4 text-[16px] leading-[1.2] font-normal sm:w-[324px]"
        >
          <Image src={ICONS.upload} width={14} height={14} alt="" />
          Upload signature file to Accept
        </Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-[14px] text-[#b91c1c]">
          {error}
        </p>
      ) : (
        <p className="text-[12px] text-[#6a6a6a]">
          PDF, PNG or JPG up to 10 MB
        </p>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Decline this contract?"
        description={`${client} will be told you've declined this engagement.`}
        confirmLabel="Decline contract"
        onConfirm={() => {
          decline(contractId);
          setConfirmOpen(false);
          toast("Contract declined");
          router.push(CONTRACTS_HREF);
        }}
      />
    </div>
  );
}

/** Contract Signing Details (Figma 11574:13150). */
export function ContractDetail({ id }: { id: string }) {
  const contract = findContract(id)!;
  const { detail } = contract;
  const client =
    detail.info.find((row) => row.label === "Client")?.value ??
    contract.company;

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink href={CONTRACTS_HREF} label="Back to Contract Requests" />
        <StatusBadge tone="warning">{detail.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)]">
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="project-description" className={card}>
            <div className="flex flex-col gap-3">
              <h2 id="project-description" className={cardTitle}>
                Project Description
              </h2>
              <p className="text-[16px] leading-[1.5] font-light text-ink-400">
                {detail.description}
              </p>
            </div>
            <h3 className="text-[20px] leading-[1.2] text-[#102a2b]">
              Scope Summary
            </h3>
            <ul className="flex flex-col">
              {detail.scope.map((item) => (
                <li
                  key={item.label}
                  className="flex items-end justify-between gap-4 border-b border-[#f2f2f2] py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="text-[16px] leading-[1.2] text-ink-400 sm:text-[18px]">
                    {item.label}
                  </span>
                  <StatusBadge tone={scopeBadge[item.status].tone}>
                    {scopeBadge[item.status].label}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </section>
          <ProjectFiles contractId={contract.id} files={detail.files} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="project-info" className={card}>
            <h2 id="project-info" className={cardTitle}>
              Project Info
            </h2>
            <DetailRows rows={detail.info} />
          </section>
          <Timeline items={detail.timeline} />
        </div>
      </div>

      <SignatureActions contractId={contract.id} client={client} />
    </div>
  );
}
