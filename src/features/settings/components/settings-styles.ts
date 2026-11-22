/** Shared Figma styles for the Settings screens (11380:12092 / 11380:12024). */

export const settingsCard =
  "rounded-[16px] bg-white p-4 drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] sm:p-6";

export const sectionTitle =
  "font-onest text-[20px] leading-[1.5] font-bold text-[#2b2b2b]";

export const fieldLabel =
  "font-onest text-[16px] leading-[1.5] font-semibold text-[#555]";

export const fieldInput =
  "h-12 rounded-[4px] border-field-border bg-white px-3 py-2 font-onest text-[16px] leading-[1.5] text-ink shadow-none placeholder:text-[#6c757d] md:text-[16px] focus-visible:border-brand-400 focus-visible:ring-brand-400/30";

export const passwordInput = `${fieldInput} border-[#555]`;

export const fieldError = "font-onest text-[14px] leading-[1.3] text-alert";

/** Figma uses #f2415a; darkened to #c81e3a to reach 4.5:1 on white. */
export const discardButton =
  "h-12 rounded-[4px] border border-[#c81e3a] bg-white px-6 py-[10px] font-onest text-[14px] leading-[1.5] font-medium text-[#c81e3a] hover:bg-[#c81e3a]/5 focus-visible:ring-[#c81e3a]/30";

export const saveButton =
  "h-12 rounded-[4px] p-[10px] text-[14px] leading-[1.5] font-semibold text-white sm:w-[170px]";
