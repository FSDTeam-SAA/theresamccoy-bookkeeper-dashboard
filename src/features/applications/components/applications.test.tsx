import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  useApplicationsStore,
  type BookkeeperApplication,
} from "@/store/applications.store";
import { getPageTokens } from "../utils";
import { ApplicationForm } from "./application-form";
import { ApplicationsOverview } from "./applications-overview";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const statuses = ["Submitted", "Under Review", "Approved", "Rejected"] as const;

function makeApps(count: number): BookkeeperApplication[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `APP-${String(124 - i).padStart(5, "0")}`,
    submittedAt: `2026-08-${String(8 - (i % 8)).padStart(2, "0")}T12:00:00.000Z`,
    professionalTitle: i === 0 ? "Senior Bookkeeper" : `Bookkeeper ${i}`,
    experience: "5+ Years",
    specializations:
      i % 2 === 0 ? ["QuickBooks", "Payroll"] : ["Accounts Payable"],
    status: statuses[i % 4],
    source: "dashboard",
    resumeFileName: "resume.pdf",
  }));
}

const bodyRows = () =>
  within(screen.getByRole("table")).getAllByRole("row").slice(1);

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  useApplicationsStore.setState({ applications: [] });
});

it("shows the empty state when no applications exist", () => {
  render(<ApplicationsOverview />);
  expect(screen.getByText("No application applied yet")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Apply as a Bookkeeper" }),
  ).toHaveAttribute("href", "/dashboard/application/submissions/new");
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("lists applications with formatted dates and a disabled resume preview", () => {
  useApplicationsStore.setState({ applications: makeApps(3) });
  render(<ApplicationsOverview />);
  expect(
    screen.getByRole("heading", { name: "Applications" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  const first = bodyRows()[0];
  expect(within(first).getByText("APP-00124")).toBeInTheDocument();
  expect(within(first).getByText("Aug 08, 2026")).toBeInTheDocument();
  expect(within(first).getByText("QuickBooks, Payroll")).toBeInTheDocument();
  expect(
    within(first).getByRole("button", { name: /view resume/i }),
  ).toBeDisabled();
  expect(screen.getByText("Showing 1 to 3 of 3 results")).toBeInTheDocument();
});

it("narrows results with search, status and specialization filters", () => {
  useApplicationsStore.setState({ applications: makeApps(8) });
  render(<ApplicationsOverview />);

  fireEvent.change(screen.getByLabelText("Search applications"), {
    target: { value: "senior" },
  });
  expect(bodyRows()).toHaveLength(1);
  expect(screen.getByText("Senior Bookkeeper")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Search applications"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByLabelText("Filter by status"), {
    target: { value: "Approved" },
  });
  expect(bodyRows()).toHaveLength(2);
  bodyRows().forEach((row) =>
    expect(within(row).getByText("Approved")).toBeInTheDocument(),
  );

  fireEvent.change(screen.getByLabelText("Filter by status"), {
    target: { value: "all" },
  });
  fireEvent.change(screen.getByLabelText("Filter by specialization"), {
    target: { value: "Accounts Payable" },
  });
  expect(bodyRows()).toHaveLength(4);
  expect(screen.getByText("Showing 1 to 4 of 4 results")).toBeInTheDocument();
});

it("paginates five rows per page", () => {
  useApplicationsStore.setState({ applications: makeApps(12) });
  render(<ApplicationsOverview />);
  const nav = screen.getByRole("navigation", { name: "Pagination" });

  expect(bodyRows()).toHaveLength(5);
  expect(screen.getByText("Showing 1 to 5 of 12 results")).toBeInTheDocument();
  expect(within(nav).getByRole("button", { name: "Page 1" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    within(nav).getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();

  fireEvent.click(within(nav).getByRole("button", { name: "Page 3" }));
  expect(bodyRows()).toHaveLength(2);
  expect(
    screen.getByText("Showing 11 to 12 of 12 results"),
  ).toBeInTheDocument();
  expect(within(nav).getByRole("button", { name: "Next page" })).toBeDisabled();

  fireEvent.click(within(nav).getByRole("button", { name: "Previous page" }));
  expect(screen.getByText("Showing 6 to 10 of 12 results")).toBeInTheDocument();
});

it("builds page tokens with ellipses", () => {
  expect(getPageTokens(1, 8)).toEqual([1, 2, 3, "ellipsis-end", 8]);
  expect(getPageTokens(5, 10)).toEqual([
    1,
    "ellipsis-start",
    4,
    5,
    6,
    "ellipsis-end",
    10,
  ]);
  expect(getPageTokens(2, 3)).toEqual([1, 2, 3]);
});

it("adds and removes chips without duplicates", () => {
  render(<ApplicationForm />);
  const input = screen.getByLabelText("Skills & Appreciation");
  fireEvent.change(input, { target: { value: "  Bank Reconciliation " } });
  fireEvent.click(screen.getByRole("button", { name: "Add skill" }));
  fireEvent.change(input, { target: { value: "bank reconciliation" } });
  fireEvent.keyDown(input, { key: "Enter" });

  const list = screen.getByRole("list", {
    name: /skills & appreciation added/i,
  });
  expect(within(list).getAllByRole("listitem")).toHaveLength(1);
  expect(within(list).getByText("Bank Reconciliation")).toBeInTheDocument();
  expect(input).toHaveValue("");

  fireEvent.click(
    screen.getByRole("button", { name: "Remove Bank Reconciliation" }),
  );
  expect(screen.queryByText("Bank Reconciliation")).not.toBeInTheDocument();
});

it("blocks submission until required fields are provided", async () => {
  render(<ApplicationForm />);
  fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));

  expect(await screen.findByText("Upload your resume")).toBeInTheDocument();
  expect(
    screen.getByText("Enter your experience in years"),
  ).toBeInTheDocument();
  expect(screen.getByText("Add at least one skill")).toBeInTheDocument();
  expect(
    screen.getByText("Add at least one specialization"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Enter your last educational qualification"),
  ).toBeInTheDocument();
  expect(push).not.toHaveBeenCalled();
  expect(useApplicationsStore.getState().applications).toHaveLength(0);
});

it("submits a valid application to the store and returns to the list", async () => {
  render(<ApplicationForm />);
  fireEvent.change(screen.getByLabelText("Experience in years"), {
    target: { value: "6" },
  });
  fireEvent.change(screen.getByLabelText("Skills & Appreciation"), {
    target: { value: "Payroll" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add skill" }));
  fireEvent.change(screen.getByLabelText("Specialization"), {
    target: { value: "QuickBooks" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add specialization" }));
  fireEvent.change(screen.getByLabelText("Last Educational Qualification"), {
    target: { value: "BBA" },
  });
  fireEvent.change(screen.getByLabelText("Certification 1 title"), {
    target: { value: "Xero Certified Advisor" },
  });
  fireEvent.change(screen.getByLabelText("Certification 1 year"), {
    target: { value: "2021" },
  });
  fireEvent.change(screen.getByLabelText(/^Resume file/), {
    target: {
      files: [new File(["cv"], "cv.pdf", { type: "application/pdf" })],
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));

  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/dashboard/application/submissions"),
  );
  expect(useApplicationsStore.getState().applications[0]).toMatchObject({
    professionalTitle: "Xero Certified Advisor",
    experience: "6 Years",
    specializations: ["QuickBooks"],
    source: "dashboard",
    resumeFileName: "cv.pdf",
    status: "Submitted",
  });
});
