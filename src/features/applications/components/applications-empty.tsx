import { ApplyButton } from "./apply-button";

/** Figma 11525:19308 — no applications submitted yet. */
export function ApplicationsEmpty() {
  return (
    <section
      aria-labelledby="applications-empty-title"
      className="flex flex-1 flex-col px-4 pt-8 pb-10 sm:px-10 sm:pt-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1
          id="applications-empty-title"
          className="font-onest text-[20px] leading-[1.2] font-semibold text-ink sm:text-[24px]"
        >
          Submit Application to become a Bookkeeper
        </h1>
        <ApplyButton />
      </div>
      <div className="flex min-h-[320px] flex-1 items-center justify-center py-16">
        <p className="text-center font-onest text-[26px] leading-[1.2] font-light text-[#bababa] sm:text-[36px]">
          No application applied yet
        </p>
      </div>
    </section>
  );
}
