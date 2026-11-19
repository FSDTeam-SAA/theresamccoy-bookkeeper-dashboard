"use client";

import Link from "next/link";
import { Fragment } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PROFILE_ICONS, PROFILE_ROUTES } from "../constants";
import { useProfileHydrated, useProfileStore } from "../store";
import type { PortfolioItem } from "../types";
import {
  ListDivider,
  ProfileIcon,
  ProfileMeta,
  ProfilePhoto,
  SectionCard,
  chipClass,
} from "./profile-ui";

const rowTitleClass =
  "font-onest text-[18px] leading-[1.2] font-medium text-ink sm:text-[20px]";
const rowSubtitleClass =
  "font-onest text-[14px] leading-[1.2] font-light text-[#6a6a6a] sm:text-[16px]";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <dt className="font-onest text-[16px] leading-[1.2] font-normal text-ink">
        {label}
      </dt>
      <dd className="font-onest text-[16px] leading-[1.2] font-light break-words text-ink-400">
        {value}
      </dd>
    </div>
  );
}

function ViewFileButton({ item }: { item: PortfolioItem }) {
  return (
    <Button
      type="button"
      variant="brand-outline"
      disabled={!item.fileName}
      title={item.fileName ?? "No file uploaded"}
      aria-label={`View file for ${item.title}`}
      onClick={() =>
        toast.info(item.fileName ?? "No file uploaded", {
          description: "File previews will be available once uploads are live.",
        })
      }
      className="h-auto rounded-[8px] border-[0.5px] px-4 py-2 text-[12px] leading-[1.2] font-light"
    >
      View File
    </Button>
  );
}

export function ProfileView() {
  useProfileHydrated();
  const profile = useProfileStore((state) => state.profile);
  const { personal } = profile;

  return (
    <>
      {/* Summary card */}
      <section
        aria-label="Profile summary"
        className="flex w-full flex-col gap-6 rounded-[8px] bg-white p-4 sm:flex-row sm:items-center sm:gap-8 sm:p-8"
      >
        <div className="relative h-[174px] w-full shrink-0 overflow-hidden rounded-[8px] bg-[#d9d9d9] sm:w-[230px]">
          <ProfilePhoto src={profile.photoUrl} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2.5">
            <p className="min-w-0 flex-1 font-onest text-[28px] leading-[1.2] font-semibold break-words text-ink sm:text-[36px]">
              {personal.fullName}
            </p>
            <Button
              asChild
              variant="brand"
              className="h-auto self-start rounded-[8px] px-8 py-4 text-[16px] leading-[1.2] font-light sm:self-auto"
            >
              <Link href={PROFILE_ROUTES.edit}>
                Edit Profile &amp; Skills
                <ProfileIcon src={PROFILE_ICONS.editPen} size={20} />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-onest text-[18px] leading-[1.5] font-light text-ink sm:text-[20px]">
              {profile.headline}
            </p>
            <ProfileMeta profile={profile} />
            {profile.availableNow ? (
              <p className="font-onest text-[18px] leading-[1.2] font-normal text-[#059669]">
                Available Now
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <SectionCard title="Personal Information" titleId="profile-personal">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoField label="Full Name" value={personal.fullName} />
          <InfoField label="Email" value={personal.email} />
          <InfoField label="Location" value={personal.location} />
          <InfoField label="Phone" value={personal.phone} />
          <div className="md:col-span-2">
            <InfoField label="Professional Bio" value={personal.bio} />
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="Skills & Appreciation" titleId="profile-skills">
        {profile.skills.length ? (
          <ul className="flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <li key={skill} className={chipClass}>
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className={rowSubtitleClass}>No skills added yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Certificates" titleId="profile-certificates">
        {profile.certificates.length ? (
          <ul className="flex flex-col gap-4">
            {profile.certificates.map((cert, index) => (
              <Fragment key={cert.id}>
                {index > 0 ? (
                  <li aria-hidden="true">
                    <ListDivider />
                  </li>
                ) : null}
                <li className="flex items-center gap-2">
                  <ProfileIcon src={PROFILE_ICONS.certificate} size={20} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className={rowTitleClass}>{cert.title}</p>
                    {cert.issuer ? (
                      <p className={rowSubtitleClass}>{cert.issuer}</p>
                    ) : null}
                  </div>
                  <p className="font-onest text-[18px] leading-[1.2] font-normal text-ink sm:text-[20px]">
                    {cert.year}
                  </p>
                </li>
              </Fragment>
            ))}
          </ul>
        ) : (
          <p className={rowSubtitleClass}>No certificates added yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Portfolio" titleId="profile-portfolio">
        {profile.portfolio.length ? (
          <ul className="flex flex-col gap-4">
            {profile.portfolio.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 ? (
                  <li aria-hidden="true">
                    <ListDivider />
                  </li>
                ) : null}
                <li className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-2 md:items-center">
                    <ProfileIcon
                      src={PROFILE_ICONS.portfolioFile}
                      size={20}
                      className="mt-0.5 md:mt-0"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className={rowTitleClass}>{item.title}</p>
                      <p className={rowSubtitleClass}>{item.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1 pl-7 md:pl-0">
                    <span className="rounded-[8px] bg-brand-50 px-4 py-2 font-onest text-[12px] leading-[1.2] font-light text-[#6a6a6a]">
                      {item.department}
                    </span>
                    <ViewFileButton item={item} />
                  </div>
                </li>
              </Fragment>
            ))}
          </ul>
        ) : (
          <p className={rowSubtitleClass}>No portfolio items added yet.</p>
        )}
      </SectionCard>
    </>
  );
}
