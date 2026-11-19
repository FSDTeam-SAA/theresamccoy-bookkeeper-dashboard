import { act, render, screen } from "@testing-library/react";
import { OverviewPage } from "./pages/overview-page";
import { useApplicationsStore } from "@/store/applications.store";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Sarah Chen" } } }),
}));

beforeEach(() => {
  localStorage.clear();
  useApplicationsStore.setState({ applications: [] });
});

test("greets the bookkeeper and links each call to action to its flow", () => {
  render(<OverviewPage />);

  expect(
    screen.getByRole("heading", { name: "Welcome back, Sarah" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Complete Profile" })).toHaveAttribute(
    "href",
    "/dashboard/profile/edit",
  );
  expect(
    screen.getByRole("link", { name: "Continue Assessment" }),
  ).toHaveAttribute(
    "href",
    "/dashboard/application/assessments/core-bookkeeping-fundamentals",
  );
  expect(
    screen.getByRole("link", { name: /View Public Profile/ }),
  ).toHaveAttribute("href", "/dashboard/profile");
  expect(screen.getByRole("img", { name: "Profile 82% complete" })).toBeInTheDocument();
});

test("prompts to finish onboarding until an onboarding application exists", async () => {
  render(<OverviewPage />);
  expect(
    await screen.findByRole("link", { name: "Continue application" }),
  ).toHaveAttribute("href", "/apply");

  act(() => {
    useApplicationsStore.getState().submitApplication({
      professionalTitle: "Bookkeeper",
      experience: "5+ Years",
      specializations: ["Payroll"],
      source: "onboarding",
    });
  });

  expect(
    screen.queryByRole("link", { name: "Continue application" }),
  ).not.toBeInTheDocument();
});
