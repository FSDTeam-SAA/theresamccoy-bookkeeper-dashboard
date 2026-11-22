"use client";

import Image from "next/image";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import { ICONS, findCourse } from "../constants";
import { notifyComingSoon } from "./course-ui";

/** Resources tab (Figma 11392:7967). Files are not hosted yet, so downloads toast. */
export function ResourcesList({ slug }: { slug: string }) {
  const resources = findCourse(slug)!.detail!.resources;

  return (
    <ul className="flex flex-col gap-4" aria-label="Course resources">
      {resources.map((resource) => (
        <li
          key={resource.id}
          className="flex min-h-[82px] items-center gap-2 rounded-[8px] bg-white p-4 drop-shadow-[4px_2px_3px_rgba(0,0,0,0.1)]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-[10px]">
            <Image src={ICONS.file} width={32} height={32} alt="" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-[16px] leading-[1.5] font-semibold text-ink sm:text-[18px]">
                {resource.name}
              </p>
              <p className="text-[14px] leading-[1.2] text-[#6a6a6a] sm:text-[16px]">
                {resource.meta}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => notifyComingSoon("Resource downloads")}
            aria-label={`Download ${resource.name}`}
            className="h-auto shrink-0 gap-2 rounded-[8px] border-[#e3e3e3] bg-white px-3 py-2 text-[16px] leading-[1.2] font-medium text-[#6a6a6a] shadow-none hover:bg-mist hover:text-brand-900 sm:px-4"
          >
            <MaskIcon src={ICONS.download} size={20} />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
