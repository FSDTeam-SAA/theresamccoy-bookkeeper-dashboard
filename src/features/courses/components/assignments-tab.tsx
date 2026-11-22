import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ICONS, assignmentHref, findCourse } from "../constants";
import { AssignmentStatus } from "./assignment-status";

/** Assignments tab (Figma 11392:7845). */
export function AssignmentsTab({ slug }: { slug: string }) {
  const assignments = findCourse(slug)!.detail!.assignments;

  return (
    <ul className="flex flex-col gap-4">
      {assignments.map((assignment) => {
        const titleId = `assignment-${assignment.id}-title`;
        return (
          <li
            key={assignment.id}
            aria-labelledby={titleId}
            className="flex flex-col items-start gap-6 rounded-[8px] bg-white p-4"
          >
            <div className="flex w-full flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <h2
                  id={titleId}
                  className="text-[20px] leading-[1.2] font-semibold text-ink sm:text-[24px]"
                >
                  {assignment.title}
                </h2>
                <p className="text-[14px] leading-[1.2] text-[#6a6a6a]">
                  Due: {assignment.due} · Instructor: {assignment.instructor}
                </p>
              </div>
              <AssignmentStatus slug={slug} assignmentId={assignment.id} />
            </div>

            <div className="flex w-full flex-col gap-4 rounded-[8px] bg-[#f5f5f5] p-4">
              <h3 className="text-[20px] leading-[1.2] font-semibold text-ink">
                Instructions
              </h3>
              <p className="text-[16px] leading-[1.5] text-[#6a6a6a]">
                {assignment.summary}
              </p>
            </div>

            <Button
              asChild
              variant="brand"
              className="h-[42px] rounded-[8px] p-4 text-[14px] leading-[1.5] font-semibold"
            >
              <Link href={assignmentHref(slug, assignment.id)}>
                Submit Assignment
                <Image src={ICONS.uploadLight} width={18} height={18} alt="" />
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
