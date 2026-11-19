import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CompletionRing } from "../components/completion-ring";
import { OnboardingPrompt } from "../components/onboarding-prompt";
import { WelcomeHeader } from "../components/welcome-header";
import {
  ASSESSMENT_HREF,
  assessmentProgress,
  overviewStats,
  profileCompletion,
  quickActions,
  recentMessages,
  type AssessmentProgress,
} from "../constants";

const card = "rounded-[8px] bg-mist-50 drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]";
const panel =
  "flex flex-col gap-6 rounded-[8px] bg-white p-4 drop-shadow-[4px_4px_5px_rgba(0,0,0,0.12)] lg:min-h-[322px]";
const panelButton = "h-12 w-full rounded-[4px] px-4 text-[16px] font-medium";

const statusColor: Record<AssessmentProgress["status"], string> = {
  "In Progress": "text-[#0060a4]",
  "Not Started": "text-[#94a3b8]",
  Completed: "text-[#059669]",
};

function PanelHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2 leading-[1.2]">
      <h2 className="text-[18px] font-semibold text-ink">{title}</h2>
      <p className="text-[14px] font-light text-grey-200">{description}</p>
    </div>
  );
}

export function OverviewPage() {
  return (
    <>
      <WelcomeHeader />
      <main className="flex flex-col gap-6 p-4 font-onest sm:p-6">
        <OnboardingPrompt />
        {/* Marketplace status banner */}
        <section
          aria-label="Marketplace status"
          className="flex min-h-[130px] flex-col justify-center gap-4 rounded-[12px] bg-[linear-gradient(94.38deg,#063231_0%,#0b4a47_101.62%)] p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-[10px]">
            <p className="font-instrument text-[12px] leading-[1.2] font-semibold tracking-[0.96px] text-brand-200 uppercase">
              Marketplace Status
            </p>
            <p className="text-[24px] leading-[1.2] font-semibold text-white">
              Verified Bookkeeper
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-12 w-[100px] items-center justify-center gap-[6px] rounded-[8px] bg-[rgba(76,175,130,0.15)] text-[12px] leading-[1.2] font-medium text-[#94b8a2]">
              <span aria-hidden="true" className="size-[6px] rounded-[3px] bg-[#94b8a2]" />
              Available
            </span>
            <Link
              href="/dashboard/profile"
              className="flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[rgba(247,250,249,0.15)] bg-[rgba(247,250,249,0.1)] p-4 text-[12px] leading-[1.5] font-medium text-mist transition-colors hover:bg-[rgba(247,250,249,0.18)]"
            >
              View Public Profile
              <Image
                src="/images/dashboard/overview/arrow-up.svg"
                alt=""
                width={16}
                height={16}
                className="rotate-90"
              />
            </Link>
          </div>
        </section>

        {/* Stat cards */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => (
            <li key={stat.label} className={cn(card, "flex min-h-[139px] flex-col justify-center gap-4 p-4")}>
              <p className="font-wix text-[14px] leading-[1.2] text-grey-300">{stat.label}</p>
              <p className="flex items-center gap-3 text-[24px] leading-[1.2] font-semibold text-brand-900">
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: stat.dot }}
                />
                {stat.value}
              </p>
            </li>
          ))}
        </ul>

        {/* Panels */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className={cn(panel, "justify-center")}>
            <PanelHeading
              title="Profile Completion"
              description="Complete your profile to attract more clients."
            />
            <div className="flex flex-1 items-center gap-4">
              <CompletionRing percent={profileCompletion.percent} />
              <ul className="flex flex-col gap-[6px]">
                {profileCompletion.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    {item.done ? (
                      <span className="flex size-4 items-center justify-center rounded-[8px] bg-brand-900">
                        <Image src="/images/dashboard/overview/check.svg" alt="" width={9} height={9} />
                      </span>
                    ) : (
                      <span className="size-4 rounded-[8px] border-2 border-brand-100" />
                    )}
                    <span
                      className={cn(
                        "text-[14px] leading-[1.2] font-light",
                        item.done ? "text-[#102a2b]" : "text-muted-text",
                      )}
                    >
                      {item.label}
                      <span className="sr-only">{item.done ? " (complete)" : " (incomplete)"}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild variant="brand" className={panelButton}>
              <Link href="/dashboard/profile/edit">Complete Profile</Link>
            </Button>
          </section>

          <section className={cn(panel, "justify-center gap-[34px]")}>
            <PanelHeading
              title="Assessments"
              description="Keep your certification current with regular assessments."
            />
            <ul className="flex flex-col gap-4">
              {assessmentProgress.map((item) => (
                <li key={item.name} className="flex flex-col gap-[2px]">
                  <div className="flex items-center justify-between text-[14px] leading-[1.2] font-light">
                    <span className="text-ink">{item.name}</span>
                    <span className={statusColor[item.status]}>{item.status}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${item.name} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.progress}
                    className="mt-[5px] h-[5px] w-full overflow-hidden rounded-[3px] bg-[#e8f0ee]"
                  >
                    <div
                      className={cn(
                        "h-full rounded-[3px]",
                        item.status === "Completed" ? "bg-[#059669]" : "bg-[#1a5a7a]",
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild variant="brand-outline" className={panelButton}>
              <Link href={ASSESSMENT_HREF}>Continue Assessment</Link>
            </Button>
          </section>

          <section className={cn(panel, "justify-center")}>
            <PanelHeading title="Recent Messages" description="Your latest client conversations." />
            <ul className="flex flex-col px-4 py-2">
              {recentMessages.map((message, index) => (
                <li
                  key={message.from}
                  className={cn(
                    "flex items-center gap-2",
                    index === 0
                      ? "border-b-[0.5px] border-[rgba(100,116,139,0.51)] pb-3"
                      : "py-3",
                  )}
                >
                  <Image
                    src="/images/dashboard/overview/message-avatar.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-[9px] text-[14px] leading-[1.2]">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate font-medium",
                            message.unread ? "text-ink" : "text-ink-400",
                          )}
                        >
                          {message.from}
                        </span>
                        <span className="shrink-0 font-light text-grey-200">{message.time}</span>
                      </div>
                      <p className="truncate font-light text-grey-200">{message.preview}</p>
                    </div>
                    {message.unread ? (
                      <Image
                        src="/images/dashboard/overview/unread-dot.svg"
                        alt="Unread"
                        width={7}
                        height={7}
                        className="shrink-0"
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="brand-outline"
              className={panelButton}
              disabled
              title="Messages are coming soon"
            >
              View All Messages
            </Button>
          </section>
        </div>

        {/* Quick actions */}
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action) => {
            const body = (
              <>
                <Image src={action.icon} alt="" width={24} height={24} />
                <span className="flex flex-col gap-1">
                  <span className="text-[20px] leading-[1.2] font-semibold text-brand-900">
                    {action.title}
                  </span>
                  <span className="font-wix text-[14px] leading-[1.2] text-grey-300">
                    {action.description}
                  </span>
                </span>
              </>
            );
            const className = cn(
              card,
              "flex min-h-[139px] flex-col justify-between gap-4 p-4",
            );
            return (
              <li key={action.title}>
                {action.href ? (
                  <Link
                    href={action.href}
                    className={cn(className, "h-full transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-400")}
                  >
                    {body}
                  </Link>
                ) : (
                  <div className={cn(className, "h-full")}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
