import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ResetPasswordForm } from "./recovery-forms";
import { VerifyEmailForm } from "./verify-email-form";

const replace = jest.fn();
const refresh = jest.fn();
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh, push }),
}));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

function fillLogin() {
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: "hello@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
    target: { value: "test-password" },
  });
}

it("keeps rejected login credentials on screen and announces the failure", async () => {
  jest.mocked(signIn).mockResolvedValue({
    error: "CredentialsSignin",
    status: 401,
    ok: false,
    url: null,
  });
  render(<LoginForm />);
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to log in",
  );
  expect(screen.getByLabelText("Email Address")).toHaveValue(
    "hello@example.com",
  );
  expect(replace).not.toHaveBeenCalled();
});

it("uses the existing credentials provider and rejects an external redirect", async () => {
  jest.mocked(signIn).mockResolvedValue({
    error: null,
    status: 200,
    ok: true,
    url: "https://evil.example",
  });
  render(<LoginForm callbackUrl="https://evil.example" />);
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
  expect(signIn).toHaveBeenCalledWith(
    "credentials",
    expect.objectContaining({
      email: "hello@example.com",
      password: "test-password",
      redirect: false,
    }),
  );
});

it("switches account type without losing shared fields and validates company name", async () => {
  render(<SignupForm />);
  fireEvent.change(screen.getByLabelText("First Name"), {
    target: { value: "Sarah" },
  });
  fireEvent.click(screen.getByRole("button", { name: "I am a Business" }));
  expect(screen.getByLabelText("First Name")).toHaveValue("Sarah");
  fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
  await waitFor(() =>
    expect(screen.getByLabelText("Company Name")).toHaveAttribute(
      "aria-invalid",
      "true",
    ),
  );
  expect(
    screen.getByRole("button", { name: "I am a Business" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("alert")).toHaveFocus();
});

it("rejects a callback whose path becomes a protocol-relative redirect", async () => {
  jest
    .mocked(signIn)
    .mockResolvedValue({ error: null, status: 200, ok: true, url: null });
  render(<LoginForm callbackUrl={`${window.location.origin}//evil.example`} />);
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
});

it("preserves a local callback and remembers only the opted-in email", async () => {
  jest
    .mocked(signIn)
    .mockResolvedValue({ error: null, status: 200, ok: true, url: null });
  render(<LoginForm callbackUrl="/marketplace?sort=name" />);
  fillLogin();
  fireEvent.click(screen.getByRole("checkbox", { name: /Remember me/ }));
  fireEvent.click(screen.getByRole("button", { name: "Log In" }));
  await waitFor(() =>
    expect(replace).toHaveBeenCalledWith("/marketplace?sort=name"),
  );
  expect(Object.values(localStorage)).toEqual(["hello@example.com"]);
});

it("accepts a pasted complete OTP and does not pretend verification succeeded", async () => {
  render(<VerifyEmailForm />);
  fireEvent.change(screen.getByLabelText("Verification code"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  // Without a recovery session there is nothing to verify against.
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Your reset session has expired",
  );
  expect(push).not.toHaveBeenCalled();
});

it("verifies the OTP with the backend and continues to the reset step", async () => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:5001/api/v1";
  sessionStorage.setItem(
    "password-recovery",
    JSON.stringify({ email: "hello@example.com" }),
  );
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: { resetToken: "reset-token", expiresInSeconds: 600 },
    }),
  });
  render(<VerifyEmailForm />);
  fireEvent.change(screen.getByLabelText("Verification code"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  await waitFor(() => expect(push).toHaveBeenCalledWith("/reset-password"));
  expect(fetch).toHaveBeenCalledWith(
    "http://localhost:5001/api/v1/auth/verify",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ email: "hello@example.com", otp: "123456" }),
    }),
  );
  expect(JSON.parse(sessionStorage.getItem("password-recovery")!)).toEqual({
    email: "hello@example.com",
    resetToken: "reset-token",
  });
});

it("rejects mismatched passwords without reporting a successful change", async () => {
  render(<ResetPasswordForm />);
  fireEvent.change(screen.getByLabelText("Create New Password"), {
    target: { value: "test-password" },
  });
  fireEvent.change(screen.getByLabelText("Confirm New Password"), {
    target: { value: "different-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Change Password" }));
  expect(
    await screen.findByText("Passwords do not match."),
  ).toBeInTheDocument();
  expect(replace).not.toHaveBeenCalled();
});
