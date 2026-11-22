import Image from "next/image";
import Link from "next/link";
import { Libre_Caslon_Text } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EDIT_PROFILE_HREF, ICONS, profileSummary } from "../constants";
import { settingsCard } from "./settings-styles";

// Figma "Heading 6": Libre Caslon Text italic, only used for the profile name.
const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

/** Cover banner, avatar and summary shared by both Settings tabs. */
export function ProfileCard() {
  return (
    <section aria-labelledby="settings-profile-name" className={settingsCard}>
      <div className="flex flex-col items-center">
        <div
          aria-hidden="true"
          className="-mb-16 h-[160px] w-full rounded-[8px] bg-brand-900/80 sm:-mb-[86px] sm:h-[260px]"
        />
        <div className="flex w-full max-w-[340px] flex-col items-center gap-4">
          <span className="relative size-[128px] overflow-hidden rounded-full border-8 border-white bg-white sm:size-[160px]">
            <Image
              src={ICONS.avatar}
              alt={`${profileSummary.name}'s profile photo`}
              fill
              sizes="160px"
              className="object-cover"
            />
          </span>

          <div className="flex w-full flex-col items-center gap-6 text-center">
            <div className="flex w-full flex-col items-center gap-2">
              <p className="font-onest text-[12px] leading-[1.5] text-[#707070]">
                {profileSummary.handle}
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <h2
                    id="settings-profile-name"
                    className={cn(
                      caslon.className,
                      "text-[26px] leading-[1.2] font-semibold text-brand-900 italic sm:text-[32px]",
                    )}
                  >
                    {profileSummary.name}
                  </h2>
                  <Image
                    src={ICONS.verified}
                    width={22}
                    height={22}
                    alt="Verified"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="font-onest text-[16px] leading-[1.2] text-[#2b2b2b]">
                    {profileSummary.headline}
                  </p>
                  <p className="flex flex-wrap items-center justify-center gap-x-[14px] gap-y-1 font-onest text-[14px] leading-[1.2] font-light text-[#707070]">
                    <span>{profileSummary.location}</span>
                    <span
                      aria-hidden="true"
                      className="h-6 w-px bg-[#9d9d9d]"
                    />
                    <span>{profileSummary.joined}</span>
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="brand"
              className="h-12 w-full rounded-[4px] p-[10px] text-[16px] leading-[1.2] font-medium text-white"
            >
              <Link href={EDIT_PROFILE_HREF}>Edit Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
