import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { toast } from "sonner";
import { DEFAULT_PROFILE } from "../constants";
import { useProfileStore } from "../store";
import { ProfileEdit } from "./profile-edit";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  useProfileStore.setState({ profile: DEFAULT_PROFILE });
});

async function renderEdit() {
  render(<ProfileEdit />);
  return screen.findByRole("list", { name: "Your skills" });
}

it("adds a skill chip with the Add button and Enter, and removes it with ×", async () => {
  const chips = await renderEdit();
  const input = screen.getByLabelText("Add a Skill");

  fireEvent.change(input, { target: { value: "Payroll" } });
  fireEvent.click(screen.getByRole("button", { name: "Add skill" }));
  expect(within(chips).getByText("Payroll")).toBeInTheDocument();
  expect(input).toHaveValue("");

  fireEvent.change(input, { target: { value: "  Xero Migration " } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(within(chips).getByText("Xero Migration")).toBeInTheDocument();
  expect(useProfileStore.getState().profile.skills).toEqual(
    expect.arrayContaining(["Payroll", "Xero Migration"]),
  );

  // duplicates are rejected with an inline error
  fireEvent.change(input, { target: { value: "payroll" } });
  fireEvent.click(screen.getByRole("button", { name: "Add skill" }));
  expect(screen.getByRole("alert")).toHaveTextContent("already in your skills");

  fireEvent.click(screen.getByRole("button", { name: "Remove Payroll" }));
  expect(within(chips).queryByText("Payroll")).not.toBeInTheDocument();
  expect(useProfileStore.getState().profile.skills).not.toContain("Payroll");
});

it("adds a certification row, validates it and saves the section to the store", async () => {
  await renderEdit();
  const initialCount = DEFAULT_PROFILE.certificates.length;

  fireEvent.click(
    screen.getByRole("button", { name: "Add certification row" }),
  );
  const newIndex = initialCount + 1;
  const title = screen.getByLabelText(`Certification ${newIndex} title`);
  const year = screen.getByLabelText(`Certification ${newIndex} year`);

  // empty row is rejected
  fireEvent.click(screen.getByRole("button", { name: "Add certifications" }));
  expect(await screen.findByText("Title is required")).toBeInTheDocument();
  expect(useProfileStore.getState().profile.certificates).toHaveLength(
    initialCount,
  );

  fireEvent.change(title, {
    target: { value: "Certified Payroll Professional" },
  });
  fireEvent.change(year, { target: { value: "2024" } });
  fireEvent.click(screen.getByRole("button", { name: "Add certifications" }));

  await waitFor(() =>
    expect(useProfileStore.getState().profile.certificates).toHaveLength(
      initialCount + 1,
    ),
  );
  expect(useProfileStore.getState().profile.certificates.at(-1)).toMatchObject({
    title: "Certified Payroll Professional",
    year: "2024",
  });
  expect(toast.success).toHaveBeenCalledWith("Certifications saved");
});
