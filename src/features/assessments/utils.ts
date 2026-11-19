import type {
  Answers,
  AssessmentContent,
  AssessmentMeta,
  AssessmentStatus,
  Question,
} from "./types";

export const tableCellId = (tableId: string, rowId: string, columnKey: string) =>
  `${tableId}.${rowId}.${columnKey}`;

export function getAssessmentStatus(
  assessment: AssessmentMeta,
  completed: Record<string, string>,
): AssessmentStatus {
  if (completed[assessment.slug]) return "completed";
  if (!assessment.unlockedBy || completed[assessment.unlockedBy]) return "available";
  return "locked";
}

/** Every answer field id belonging to a question (inputs, selects, radios). */
export function questionFieldIds(question: Question): string[] {
  return question.parts.flatMap((part) => {
    switch (part.kind) {
      case "text":
      case "long-text":
      case "multiple-choice":
        return [part.id];
      case "table-fill":
        return part.rows.flatMap((row) =>
          part.columns
            .filter((column) => {
              const cell = row.cells[column.key];
              return typeof cell === "object" && cell !== null;
            })
            .map((column) => tableCellId(part.id, row.id, column.key)),
        );
      default:
        return [];
    }
  });
}

const hasValue = (answers: Answers, id: string) => Boolean(answers[id]?.trim());

/** Questions that take input (7A, for example, is a read-only P&L). */
export const answerableQuestions = (content: AssessmentContent) =>
  content.sections
    .flatMap((section) => section.questions)
    .filter((question) => questionFieldIds(question).length > 0);

/** Answerable questions where not a single field has been filled in. */
export function unansweredQuestions(content: AssessmentContent, answers: Answers) {
  return answerableQuestions(content).filter(
    (question) => !questionFieldIds(question).some((id) => hasValue(answers, id)),
  );
}

export const questionCount = (content: AssessmentContent) =>
  content.sections.reduce((total, section) => total + section.questions.length, 0);
