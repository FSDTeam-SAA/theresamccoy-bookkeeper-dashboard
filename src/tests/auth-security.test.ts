/** @jest-environment node */
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

jest.mock("next-auth", () => ({ __esModule: true, default: jest.fn() }));
import "@/app/api/auth/[...nextauth]/route";

const options = jest.mocked(NextAuth).mock
  .calls[0][0] as unknown as NextAuthOptions;
const jwt = options.callbacks!.jwt!;
const session = options.callbacks!.session!;
const token = {
  id: "user-1",
  name: "User",
  email: "user@example.com",
  image: "",
  role: "USER",
  accessToken: "access-token",
  accessTokenExpires: Date.now() + 3600000,
} satisfies JWT;

test("client session updates cannot change identity, role, or tokens", async () => {
  const result = await jwt({
    token: { ...token },
    trigger: "update",
    session: { user: { id: "admin-1", role: "ADMIN", accessToken: "forged" } },
  } as Parameters<typeof jwt>[0]);
  expect(result).toEqual(token);
});

test("session responses never expose refresh tokens", async () => {
  const result = await session({
    token: { ...token },
    session: { user: {}, expires: "2099-01-01" },
  } as Parameters<typeof session>[0]);
  expect(result).not.toHaveProperty("refreshToken");
  expect(result).toHaveProperty("accessToken", token.accessToken);
});

test("an ended session does not expose an expired access token", async () => {
  const result = await session({
    token: { ...token, error: "RefreshAccessTokenError" },
    session: { user: {}, expires: "2099-01-01" },
  } as Parameters<typeof session>[0]);
  expect(result).toHaveProperty("accessToken", "");
  expect(result).toHaveProperty("error", "RefreshAccessTokenError");
});

// The provider itself is the boundary: no real backend is called by these tests.
const provider = options
  .providers[0] as import("next-auth/providers/credentials").CredentialsConfig;
const authorize = provider.options!.authorize!;
const request = { body: {}, query: {}, headers: {}, method: "POST" };
const credentials = { email: "user@example.com", password: "test-password" };

beforeEach(() => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    NEXT_PUBLIC_API_URL: "https://api.example.com/api/v1",
  });
  global.fetch = jest.fn();
});
afterEach(() => jest.restoreAllMocks());

test("invalid credentials are rejected before contacting the backend", async () => {
  expect(
    await authorize({ email: "invalid", password: "x" }, request),
  ).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});

test("malformed backend login data fails closed", async () => {
  jest
    .mocked(fetch)
    .mockResolvedValue(
      new Response(JSON.stringify({ data: { user: { role: "ADMIN" } } })),
    );
  expect(await authorize(credentials, request)).toBeNull();
});

function backendJwt(expSeconds: number) {
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds })).toString(
    "base64url",
  );
  return `header.${payload}.signature`;
}

test("valid backend login data maps the backend user contract", async () => {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const accessToken = backendJwt(exp);
  jest.mocked(fetch).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          user: {
            _id: "user-1",
            firstName: "Jane",
            lastName: "Doe",
            email: "user@example.com",
            role: "bookkeeper",
          },
          accessToken,
        },
      }),
    ),
  );
  const user = await authorize(credentials, request);
  expect(user).toEqual({
    id: "user-1",
    name: "Jane Doe",
    email: "user@example.com",
    image: "",
    role: "bookkeeper",
    token: accessToken,
  });
  const signedIn = await jwt({ token: {}, user } as unknown as Parameters<
    typeof jwt
  >[0]);
  expect(signedIn).toHaveProperty("accessTokenExpires", exp * 1000);
});

test("business accounts cannot hold a bookkeeper dashboard session", async () => {
  jest.mocked(fetch).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          user: { _id: "u", email: "user@example.com", role: "business" },
          accessToken: "access-token",
        },
      }),
    ),
  );
  expect(await authorize(credentials, request)).toBeNull();
});

test("unknown backend roles are rejected", async () => {
  jest.mocked(fetch).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          user: { _id: "u", email: "user@example.com", role: "superuser" },
          accessToken: "access-token",
        },
      }),
    ),
  );
  expect(await authorize(credentials, request)).toBeNull();
});

test("an expired backend token ends the session without exposing it", async () => {
  const result = await jwt({
    token: { ...token, accessTokenExpires: 0 },
  } as Parameters<typeof jwt>[0]);
  expect(result).toHaveProperty("accessToken", "");
  expect(result).toHaveProperty("error", "RefreshAccessTokenError");
});

test("login works when the API redacts the email from the response", async () => {
  // Real backend shape: contact fields are stripped from login responses.
  jest.mocked(fetch).mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          user: {
            _id: "user-1",
            firstName: "Jane",
            lastName: "Doe",
            role: "bookkeeper",
          },
          accessToken: "access-token",
        },
      }),
    ),
  );
  expect(await authorize(credentials, request)).toMatchObject({
    id: "user-1",
    name: "Jane Doe",
    email: credentials.email,
    role: "bookkeeper",
  });
});
