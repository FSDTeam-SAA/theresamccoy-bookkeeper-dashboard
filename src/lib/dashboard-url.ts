// Maps a backend role to the dashboard app that serves it. Each value is an
// absolute origin configured per environment, e.g. https://owner.example.com.
const DASHBOARD_URLS: Record<string, string | undefined> = {
  business: process.env.NEXT_PUBLIC_OWNER_DASHBOARD_URL,
  bookkeeper: process.env.NEXT_PUBLIC_BOOKKEEPER_DASHBOARD_URL,
  admin: process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL,
};

/** Returns the dashboard entry URL for a role, or null when not configured or unsafe. */
export function getDashboardUrl(role: string | undefined): string | null {
  const raw = role ? DASHBOARD_URLS[role.toLowerCase()] : undefined;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    return `${url.origin}/dashboard`;
  } catch {
    return null;
  }
}
