"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PROFILE_ICONS, PROFILE_ROUTES, RESUME_ACCEPT } from "../constants";
import { useProfileStore } from "../store";
import { ProfileIcon, ProfileMeta, ProfilePhoto } from "./profile-ui";

const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function EditSummaryCard() {
  const profile = useProfileStore((state) => state.profile);
  const setPhotoFileName = useProfileStore((state) => state.setPhotoFileName);
  const setResumeFileName = useProfileStore((state) => state.setResumeFileName);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Revoke the previous object URL whenever it changes and on unmount.
  useEffect(() => {
    if (!photoPreview) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFileName(file.name);
    toast.success("Profile photo updated");
  };

  const onResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!RESUME_TYPES.has(file.type) && !/\.(pdf|docx?)$/i.test(file.name)) {
      toast.error("Resume must be a PDF or Word document.");
      return;
    }
    setResumeFileName(file.name);
    toast.success("Resume uploaded", { description: file.name });
  };

  return (
    <section
      aria-label="Profile summary"
      className="flex w-full flex-col gap-6 rounded-[8px] bg-white p-4 sm:flex-row sm:items-center sm:gap-8 sm:p-5"
    >
      <div className="relative h-[174px] w-full shrink-0 overflow-hidden rounded-[8px] bg-[#d9d9d9] sm:w-[230px]">
        {photoPreview ? (
          <ProfilePhoto src={photoPreview} unoptimized />
        ) : (
          <ProfilePhoto src={profile.photoUrl} objectPosition="50% 15%" />
        )}
        <button
          type="button"
          aria-label="Change profile photo"
          onClick={() => photoInputRef.current?.click()}
          className="absolute right-2 bottom-[6.5px] flex size-[27px] cursor-pointer items-center justify-center rounded-[4px] bg-[#d9d9d9] outline-none hover:bg-brand-100 focus-visible:ring-[3px] focus-visible:ring-brand-400/50"
        >
          <ProfileIcon src={PROFILE_ICONS.photoEdit} size={18} />
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label="Profile photo file"
          onChange={onPhotoChange}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2.5">
          <p className="min-w-0 flex-1 font-onest text-[28px] leading-[1.2] font-semibold break-words text-ink sm:text-[36px]">
            {profile.personal.fullName}
          </p>
          <Button
            asChild
            variant="brand-outline"
            className="h-auto self-start rounded-[8px] px-6 py-3 text-[14px] leading-[1.2] font-light sm:self-auto"
          >
            <Link href={PROFILE_ROUTES.view}>Back to Profile</Link>
          </Button>
        </div>
        <p className="font-onest text-[18px] leading-[1.5] font-light text-ink sm:text-[20px]">
          {profile.headline}
        </p>
        <ProfileMeta profile={profile} />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="brand-outline"
            onClick={() => resumeInputRef.current?.click()}
            className="h-auto rounded-[32px] px-4 py-2 text-[14px] leading-[1.2] font-light"
          >
            Upload Resume
            <ProfileIcon src={PROFILE_ICONS.upload} size={16} />
          </Button>
          {profile.resumeFileName ? (
            <span className="truncate font-onest text-[14px] font-light text-[#6a6a6a]">
              {profile.resumeFileName}
            </span>
          ) : null}
          <input
            ref={resumeInputRef}
            type="file"
            accept={RESUME_ACCEPT}
            className="sr-only"
            tabIndex={-1}
            aria-label="Resume file"
            onChange={onResumeChange}
          />
        </div>
      </div>
    </section>
  );
}
