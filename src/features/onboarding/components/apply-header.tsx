import Image from "next/image";
import Link from "next/link";

const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
const backHref = websiteUrl
  ? `${websiteUrl.replace(/\/+$/, "")}/training`
  : "/dashboard";

export function ApplyTopBar() {
  const content = (
    <>
      <Image
        src="/images/apply/back-chevron.svg"
        width={16}
        height={16}
        alt=""
        aria-hidden="true"
      />
      Back to Training
    </>
  );
  const className =
    "inline-flex items-center gap-1.5 rounded font-onest text-sm leading-[1.2] font-light text-[#6a7282] outline-none hover:text-brand-900 focus-visible:ring-2 focus-visible:ring-brand-400";
  return (
    <header className="flex h-[79px] items-center bg-brand-50 px-4 py-5 sm:px-10">
      {websiteUrl ? (
        <a href={backHref} className={className}>
          {content}
        </a>
      ) : (
        <Link href={backHref} className={className}>
          {content}
        </Link>
      )}
    </header>
  );
}

export function ApplyHero() {
  return (
    <section
      aria-labelledby="apply-title"
      className="flex min-h-[186px] w-full flex-col justify-center gap-2 rounded-t-lg bg-brand-900 py-4 pr-6 pl-6 font-onest text-white sm:pl-8"
    >
      <h1
        id="apply-title"
        className="text-2xl leading-[1.2] font-medium sm:text-[32px]"
      >
        Join the CPA-Vetted Bookkeeper Network
      </h1>
      <p className="text-sm leading-[1.2]">
        Now accepting bookkeeper applications.
      </p>
      <p className="text-sm leading-[1.2]">
        Join the CPA-Vetted Bookkeeper Network. Apply to The Bookkeepers
        Marketplace — where qualified professionals get matched with growing
        businesses. Complete the form, download your assessment, and upload
        your resume to get started.
      </p>
    </section>
  );
}
