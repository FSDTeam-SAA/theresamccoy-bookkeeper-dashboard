import type { CookiesOptions } from "next-auth";

// Each app on the platform keeps its own next-auth cookies. Browsers do not
// separate cookies by port, so with shared default names the apps would
// overwrite each other's sessions on localhost (and on a shared parent domain).
const APP_PREFIX = "tbm-bookkeeper";
const secure = process.env.NODE_ENV === "production";
const prefix = secure ? "__Secure-" : "";
const options = { httpOnly: true, sameSite: "lax" as const, path: "/", secure };

export const SESSION_COOKIE = `${prefix}${APP_PREFIX}.session-token`;

export const authCookies: Partial<CookiesOptions> = {
  sessionToken: { name: SESSION_COOKIE, options },
  callbackUrl: { name: `${prefix}${APP_PREFIX}.callback-url`, options },
  csrfToken: {
    // __Host- requires secure, so only use it in production.
    name: `${secure ? "__Host-" : ""}${APP_PREFIX}.csrf-token`,
    options,
  },
};
