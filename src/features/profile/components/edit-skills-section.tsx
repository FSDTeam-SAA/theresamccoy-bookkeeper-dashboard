"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFILE_ICONS } from "../constants";
import { skillSchema } from "../schemas";
import { useProfileStore } from "../store";
import {
  ProfileIcon,
  SectionCard,
  chipClass,
  fieldClass,
  sectionButtonClass,
} from "./profile-ui";

export function EditSkillsSection() {
  const skills = useProfileStore((state) => state.profile.skills);
  const setSkills = useProfileStore((state) => state.setSkills);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const addSkill = () => {
    const parsed = skillSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a skill");
      return;
    }
    const skill = parsed.data;
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setError(`"${skill}" is already in your skills`);
      return;
    }
    setSkills([...skills, skill]);
    setDraft("");
    setError(null);
    toast.success("Skill added", { description: skill });
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
    toast.success("Skill removed", { description: skill });
  };

  return (
    <SectionCard title="Skills & Appreciation" titleId="edit-skills">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="sr-only">
            Add a Skill
          </label>
          <div className="flex items-stretch gap-3 sm:gap-4">
            <Input
              id={inputId}
              value={draft}
              placeholder="Add a Skill"
              maxLength={50}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setDraft(event.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              className={fieldClass}
            />
            <Button
              type="button"
              variant="brand"
              onClick={addSkill}
              className={sectionButtonClass}
              aria-label="Add skill"
            >
              Add
            </Button>
          </div>
          {error ? (
            <p
              id={errorId}
              role="alert"
              className="font-onest text-[14px] text-destructive"
            >
              {error}
            </p>
          ) : null}
        </div>
        {skills.length ? (
          <ul className="flex flex-wrap gap-3" aria-label="Your skills">
            {skills.map((skill) => (
              <li key={skill} className={`${chipClass} gap-2.5`}>
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => removeSkill(skill)}
                  className="flex cursor-pointer items-center rounded-sm outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-brand-400/50"
                >
                  <ProfileIcon src={PROFILE_ICONS.chipClose} size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-onest text-[14px] font-light text-[#6a6a6a]">
            No skills yet. Add your first skill above.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
