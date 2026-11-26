// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getApiUrl } from "@/lib/api-url";
import { authCookies } from "@/lib/auth-cookies";

// Roles allowed to hold a session in this app (keep in sync with src/proxy.ts).
const ALLOWED_ROLES = new Set(["bookkeeper", "admin"]);

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(1024),
});

// Mirrors POST /api/v1/auth/login → { data: { accessToken, user } }.
// The backend sends the refresh token only as an httpOnly cookie on its own
// domain, so it is intentionally not read here.
const loginResponseSchema = z.object({
  data: z.object({
    user: z
      .object({
        _id: z.string().min(1).optional(),
        id: z.string().min(1).optional(),
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        // The API redacts contact fields from login responses, so email is
        // usually absent; the submitted credentials email is used instead.
        email: z.string().email().optional(),
        profilePicture: z.string().nullish(),
        role: z.string().min(1),
      })
      .refine((user) => Boolean(user._id || user.id)),
    accessToken: z.string().min(1),
  }),
});

const FALLBACK_TTL_MS = 60 * 60 * 1000;

/** Reads the `exp` claim of the backend JWT (no verification; the backend verifies). */
function getTokenExpiry(accessToken: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1] ?? "", "base64url").toString(),
    ) as { exp?: unknown };
    if (typeof payload.exp === "number") return payload.exp * 1000;
  } catch {
    // fall through
  }
  return Date.now() + FALLBACK_TTL_MS;
}

const handler = NextAuth({
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const res = await fetch(`${getApiUrl()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
            cache: "no-store",
            redirect: "error",
            signal: AbortSignal.timeout(10_000),
          });
          if (!res.ok) return null;
          const { data } = loginResponseSchema.parse(await res.json());
          const { user } = data;
          if (!ALLOWED_ROLES.has(user.role)) return null;
          const name =
            [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
            parsed.data.email;
          return {
            id: (user._id || user.id)!,
            name,
            email: user.email ?? parsed.data.email,
            image: user.profilePicture ?? "",
            role: user.role,
            token: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          accessToken: user.token,
          accessTokenExpires: getTokenExpiry(user.token),
          error: undefined,
        };
      }

      // Identity and permissions come only from the authenticated backend.
      // Client-supplied session updates must never overwrite signed claims.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // No refresh flow yet: an expired backend token ends the session. The
      // existing error flag makes the proxy and API client sign the user out.
      return { ...token, accessToken: "", error: "RefreshAccessTokenError" };
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role,
        };
        session.accessToken = token.error ? "" : token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },

  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: authCookies,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
