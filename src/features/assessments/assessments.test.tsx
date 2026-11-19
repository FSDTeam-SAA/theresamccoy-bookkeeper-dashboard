import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { toast } from "sonner";
import { AssessmentsHub } from "./components/assessments-hub";
import { AssessmentForm } from "./components/assessment-form";
import { CORE_ASSESSMENT, CORE_ASSESSMENT_SLUG } from "./constants";
import { useAssessmentsStore } from "./store";
import { answerableQuestions, questionCount, questionFieldIds } from "./utils";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  useAssessmentsStore.setState({ completed: {}, drafts: {} });
});

const card = (title: string) => screen.getByRole("listitem", { name: title });

function answerEveryQuestion() {
  for (const question of CORE_ASSESSMENT.sections.flatMap((section) => section.questions)) {
    const [first] = questionFieldIds(question);
    if (first) useAssessmentsStore.getState().setAnswer(CORE_ASSESSMENT_SLUG, first, "x");
  }
}

test("hub shows the core assessment as available and the others locked", () => {
  render(<AssessmentsHub />);

  const core = card("Core Bookkeeping Fundamentals");
  expect(within(core).getByText("Available")).toBeInTheDocument();
  expect(within(core).getByText("Duration: 45 min")).toBeInTheDocument();
  expect(within(core).getByRole("link", { name: "Start Assessment" })).toHaveAttribute(
    "href",
    "/dashboard/application/assessments/core-bookkeeping-fundamentals",
  );

  for (const title of ["Software Proficiency: QuickBooks & Xero", "Advanced Reconciliation"]) {
    expect(within(card(title)).getByText("Locked")).toBeInTheDocument();
    expect(within(card(title)).queryByRole("link")).not.toBeInTheDocument();
  }
});

test("completing the core assessment unlocks software proficiency on the hub", () => {
  render(<AssessmentsHub />);
  act(() => useAssessmentsStore.getState().markCompleted(CORE_ASSESSMENT_SLUG));

  const core = card("Core Bookkeeping Fundamentals");
  expect(within(core).getByText("Completed")).toBeInTheDocument();
  expect(within(core).getByRole("link", { name: "Retake Assessment" })).toBeInTheDocument();
  expect(
    within(card("Software Proficiency: QuickBooks & Xero")).getByRole("link", {
      name: "Start Assessment",
    }),
  ).toHaveAttribute("href", "/dashboard/application/assessments/software-proficiency");
  expect(within(card("Advanced Reconciliation")).getByText("Locked")).toBeInTheDocument();
});

test("renders every Figma question and autosaves answers as drafts", () => {
  render(<AssessmentForm slug={CORE_ASSESSMENT_SLUG} content={CORE_ASSESSMENT} />);

  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
    questionCount(CORE_ASSESSMENT),
  );
  expect(screen.getByText("Question 9CD")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("(a) Sales tax owed at a rate of 6.5%:"), {
    target: { value: "$3,168.75" },
  });
  fireEvent.change(screen.getByLabelText("Accounts Receivable — Account type (fill in)"), {
    target: { value: "Asset" },
  });
  fireEvent.click(screen.getByRole("radio", { name: "L = E + A" }));

  expect(useAssessmentsStore.getState().drafts[CORE_ASSESSMENT_SLUG]).toMatchObject({
    "q1a.a": "$3,168.75",
    "q3a.accounts.row-1.type": "Asset",
    "q9cd.choice": "L = E + A",
  });
  expect(screen.getByRole("radio", { name: "L = E + A" })).toBeChecked();
});

test("asks for confirmation when questions are unanswered before submitting", async () => {
  render(<AssessmentForm slug={CORE_ASSESSMENT_SLUG} content={CORE_ASSESSMENT} />);

  fireEvent.click(screen.getByRole("button", { name: "Submit Assessment" }));
  const dialog = await screen.findByRole("dialog");
  const answerable = answerableQuestions(CORE_ASSESSMENT).length;
  expect(dialog).toHaveTextContent(`${answerable} of ${answerable} questions`);

  fireEvent.click(within(dialog).getByRole("button", { name: "Submit Anyway" }));
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/dashboard/application/submissions"),
  );
});

test("submitting a complete assessment marks it completed and goes to submissions", async () => {
  answerEveryQuestion();
  render(<AssessmentForm slug={CORE_ASSESSMENT_SLUG} content={CORE_ASSESSMENT} />);

  fireEvent.click(screen.getByRole("button", { name: "Submit Assessment" }));

  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/dashboard/application/submissions"),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(toast.success).toHaveBeenCalled();
  const state = useAssessmentsStore.getState();
  expect(state.completed[CORE_ASSESSMENT_SLUG]).toEqual(expect.any(String));
  expect(state.drafts[CORE_ASSESSMENT_SLUG]).toBeUndefined();
});
