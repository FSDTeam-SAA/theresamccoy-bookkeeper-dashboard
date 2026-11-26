import { getApiUrl } from "@/lib/api-url";

/** Error carrying the backend's user-facing message. */
export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

type Envelope<T> = { success?: boolean; message?: string; data?: T };

/** POSTs to a public (unauthenticated) backend endpoint and unwraps `data`. */
export async function postPublic<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new AuthApiError("Unable to connect. Please try again.", 0);
  }
  const json = (await response.json().catch(() => ({}))) as Envelope<T>;
  if (!response.ok || json.success === false) {
    throw new AuthApiError(
      typeof json.message === "string" && json.message
        ? json.message
        : "Something went wrong. Please try again.",
      response.status,
    );
  }
  return json.data as T;
}

export type AccountRole = "bookkeeper" | "business";

export function registerAccount(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AccountRole;
}) {
  return postPublic<unknown>("/auth/register", input);
}

export function requestPasswordReset(email: string) {
  return postPublic<unknown>("/auth/forgot-password", { email });
}

export function verifyResetCode(email: string, otp: string) {
  return postPublic<{ resetToken: string; expiresInSeconds: number }>(
    "/auth/verify",
    { email, otp },
  );
}

export function resetPassword(input: {
  email: string;
  resetToken: string;
  newPassword: string;
}) {
  return postPublic<unknown>("/auth/reset-password", input);
}

// The reset flow spans three pages; keep its state for this tab only.
const RECOVERY_KEY = "password-recovery";

type RecoveryState = { email: string; resetToken?: string };

export function readRecoveryState(): RecoveryState | null {
  try {
    const raw = sessionStorage.getItem(RECOVERY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RecoveryState>;
    return typeof parsed.email === "string"
      ? { email: parsed.email, resetToken: parsed.resetToken }
      : null;
  } catch {
    return null;
  }
}

export function writeRecoveryState(state: RecoveryState | null) {
  try {
    if (state) sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(state));
    else sessionStorage.removeItem(RECOVERY_KEY);
  } catch {
    /* Recovery still works within the page when storage is blocked. */
  }
}

export function errorMessage(error: unknown) {
  return error instanceof AuthApiError
    ? error.message
    : "Something went wrong. Please try again.";
}
