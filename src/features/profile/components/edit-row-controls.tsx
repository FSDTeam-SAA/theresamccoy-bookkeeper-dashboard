import { Button } from "@/components/ui/button";
import { PROFILE_ICONS } from "../constants";
import { ProfileIcon, sectionButtonClass } from "./profile-ui";

/** "+" (add an empty row) on the left, dark "Add" (save the section) on the right. */
export function RowControls({
  addRowLabel,
  saveLabel,
  onAddRow,
}: {
  addRowLabel: string;
  saveLabel: string;
  onAddRow: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        aria-label={addRowLabel}
        onClick={onAddRow}
        className="h-auto rounded-[8px] border-[#b5bec0] bg-white px-6 py-3 shadow-none hover:bg-brand-50"
      >
        <ProfileIcon src={PROFILE_ICONS.plus} size={26} />
      </Button>
      <Button
        type="submit"
        variant="brand"
        aria-label={saveLabel}
        className={sectionButtonClass}
      >
        Add
      </Button>
    </div>
  );
}

/** Small text-only remove control shown under each editable row. */
export function RemoveRowButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="cursor-pointer self-start rounded-sm font-onest text-[13px] font-light text-alert outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-400/50"
    >
      Remove
    </button>
  );
}
