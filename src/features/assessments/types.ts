/** Answers keyed by field id (table cells use `${tableId}.${rowId}.${columnKey}`). */
export type Answers = Record<string, string>;

export type AssessmentStatus = "available" | "locked" | "completed";

export type AssessmentMeta = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  /** Slug of the assessment that must be completed first; omitted = open. */
  unlockedBy?: string;
  /** False when no question set exists yet (renders a "coming soon" state). */
  hasContent: boolean;
};

/* ---------- Table fill ---------- */

export type TableInputCell = {
  input: "text";
  /** Placeholder copy; tables without one render the blank grey Figma input. */
  placeholder?: string;
};

export type TableSelectCell = {
  input: "select";
  options: readonly string[];
  placeholder: string;
};

/** Static text, an input, or `null` for an intentionally empty cell. */
export type TableCell = string | TableInputCell | TableSelectCell | null;

export type TableColumn = {
  key: string;
  header: string;
  align?: "left" | "center";
  /** `index` = narrow 20px "#" column, `muted` = light grey static text. */
  variant?: "default" | "index" | "muted";
};

export type TableRow = {
  id: string;
  cells: Record<string, TableCell>;
  /** `highlight` = deep-teal-50 row (totals), `strong` = highlight + medium label. */
  variant?: "default" | "highlight" | "strong";
};

/* ---------- P&L statement (read-only) ---------- */

export type StatementRow = {
  label: string;
  amount?: string;
  variant: "section" | "line" | "anomaly" | "total" | "grand-total";
};

/* ---------- Question parts ---------- */

export type TextPart = {
  kind: "text";
  id: string;
  label?: string;
  placeholder: string;
};

export type LongTextPart = {
  kind: "long-text";
  id: string;
  label?: string;
  placeholder: string;
};

export type MultipleChoicePart = {
  kind: "multiple-choice";
  id: string;
  options: readonly string[];
};

export type TableFillPart = {
  kind: "table-fill";
  id: string;
  caption: string;
  columns: readonly TableColumn[];
  rows: readonly TableRow[];
};

export type StatementPart = {
  kind: "statement";
  caption: string;
  rows: readonly StatementRow[];
};

export type FactsPart = { kind: "facts"; lines: readonly string[] };

export type NotePart = { kind: "note"; text: string };

export type QuestionPart =
  | TextPart
  | LongTextPart
  | MultipleChoicePart
  | TableFillPart
  | StatementPart
  | FactsPart
  | NotePart;

export type Question = {
  id: string;
  /** Label shown before the prompt, e.g. "Question 1A". */
  label: string;
  prompt: string;
  hint?: string;
  parts: readonly QuestionPart[];
};

export type AssessmentSection = {
  id: string;
  title: string;
  questions: readonly Question[];
};

export type CandidateField = {
  id: string;
  label: string;
  placeholder: string;
};

export type AssessmentContent = {
  title: string;
  subtitle: string;
  instructionsLead: string;
  instructions: string;
  candidateFields: readonly CandidateField[];
  /** Static label/value shown beside the candidate fields. */
  candidateStatic: { label: string; value: string };
  sections: readonly AssessmentSection[];
  acknowledgment: {
    title: string;
    text: string;
    signature: CandidateField;
    date: CandidateField;
  };
  submitLabel: string;
  downloadLabel: string;
  footer: string;
};
