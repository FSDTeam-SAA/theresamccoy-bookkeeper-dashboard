import type { PersonalInfo, SettingsTab } from "./types";

/**
 * Copy transcribed from Figma (file YcS6lbNoziPOaqZ1QPNCSk):
 * profile tab = node 11380:12092, password tab = node 11380:12024.
 * Static until the account settings endpoints exist.
 */

export const SETTINGS_HREF = "/dashboard/settings";
export const SETTINGS_PASSWORD_HREF = `${SETTINGS_HREF}/password`;
export const EDIT_PROFILE_HREF = "/dashboard/profile/edit";

export const SETTINGS_TITLE = "Settings";
// Verbatim from Figma (the frame reuses the Engagement subtitle).
export const SETTINGS_SUBTITLE =
  "Your active marketplace engagements and project workspaces.";

export const SETTINGS_TABS: { id: SettingsTab; label: string; href: string }[] =
  [
    { id: "profile", label: "Profile", href: SETTINGS_HREF },
    { id: "password", label: "Password", href: SETTINGS_PASSWORD_HREF },
  ];

export const ICONS = {
  verified: "/images/settings/check-verified.svg",
  eye: "/images/settings/eye.svg",
  avatar: "/images/settings/profile-avatar.jpg",
} as const;

export const profileSummary = {
  handle: "@sia.product",
  name: "Sia Marium",
  headline: "Product Designer, 4+ Years of experience",
  location: "New York, USA",
  joined: "Joined December 2025",
};

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  firstName: "Mandy",
  lastName: "Chen",
  email: "mandychen@gmail.com",
  phone: "+1 (222) 155-0470",
};

export const PASSWORD_MIN_LENGTH = 8;

export const NOT_CONNECTED =
  "Account changes aren’t connected to the server yet.";
