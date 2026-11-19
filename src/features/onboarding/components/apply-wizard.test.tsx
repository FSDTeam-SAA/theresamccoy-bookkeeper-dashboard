import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ApplyWizard, toApplication } from "./apply-wizard";
import { useOnboardingStore } from "../store";
import { EMPTY_DRAFT } from "../schema";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
jest.mock("sonner", () => ({ toast: { success: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  useOnboardingStore.getState().reset();
  window.scrollTo = jest.fn();
});

function fillRequiredPersonal() {
  const values: Record<string, string> = {
    "First Name *": "Savannah",
    "Last Name *": "Nguyen",
    "City *": "Austin",
    "State *": "Texas",
  };
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

it("blocks Next on step 1 until required fields are valid", async () => {
  render(<ApplyWizard />);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await waitFor(() =>
    expect(screen.getByLabelText("First Name *")).toHaveAttribute(
      "aria-invalid",
      "true",
    ),
  );
  expect(screen.getByText("City is required")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Personal information" }),
  ).toBeInTheDocument();
  expect(useOnboardingStore.getState().step).toBe(0);
});

it("advances to Experience when required fields are filled and Back keeps values", async () => {
  render(<ApplyWizard />);
  fillRequiredPersonal();
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: "savannah@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  const heading = await screen.findByRole("heading", {
    name: "Professional experience",
  });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(
    screen.getByRole("listitem", { current: "step" }),
  ).toHaveTextContent("Experience");

  // Industries are required on step 2.
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(
    await screen.findByText("Select at least one industry"),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Technology & SaaS"));

  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByRole("heading", { name: "Personal information" });
  expect(screen.getByLabelText("First Name *")).toHaveValue("Savannah");
  expect(screen.getByLabelText("Email Address")).toHaveValue(
    "savannah@example.com",
  );
  // Step 2 edits survive the round trip via the persisted draft.
  expect(useOnboardingStore.getState().draft.experience.industries).toEqual([
    "Technology & SaaS",
  ]);
});

it("maps the draft to the shared application payload", () => {
  const draft: typeof EMPTY_DRAFT = JSON.parse(JSON.stringify(EMPTY_DRAFT));
  draft.experience.credential = "CPA";
  draft.experience.yearsExperience = "5+ years";
  draft.experience.industries = ["Retail & e-commerce"];
  draft.skills.coreSkills = ["Payroll processing", "Job costing", "AI tools"];
  draft.assessment.resumeFileName = "resume.pdf";
  expect(toApplication(draft)).toEqual({
    professionalTitle: "CPA",
    experience: "5+ years",
    specializations: [
      "Retail & e-commerce",
      "Payroll processing",
      "Job costing",
      "AI tools",
    ],
    source: "onboarding",
    resumeFileName: "resume.pdf",
  });
  draft.experience.credential = "None";
  expect(toApplication(draft).professionalTitle).toBe("Bookkeeper");
});
