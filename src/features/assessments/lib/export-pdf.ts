import type { Answers, AssessmentContent, QuestionPart } from "../types";
import { tableCellId } from "../utils";

/** Plain-text lines for one question part, including the candidate's answers. */
function partLines(part: QuestionPart, answers: Answers): string[] {
  const value = (id: string) => answers[id]?.trim() || "—";
  switch (part.kind) {
    case "text":
    case "long-text":
      return [...(part.label ? [part.label] : []), `Answer: ${value(part.id)}`];
    case "multiple-choice":
      return [`Answer: ${value(part.id)}`];
    case "table-fill":
      return part.rows.map((row) =>
        part.columns
          .map((column) => {
            const cell = row.cells[column.key];
            if (cell === null || cell === undefined) return "";
            if (typeof cell === "string") return cell;
            return `${column.header || "Answer"}: ${value(tableCellId(part.id, row.id, column.key))}`;
          })
          .filter(Boolean)
          .join(" | "),
      );
    case "statement":
      return part.rows.map((row) => (row.amount ? `${row.label}: ${row.amount}` : row.label));
    case "facts":
      return part.lines.map((line) => `• ${line}`);
    case "note":
      return [part.text];
  }
}

/** Builds and downloads a PDF copy of the assessment with the current answers. */
export async function downloadAssessmentPdf(content: AssessmentContent, answers: Answers) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const write = (text: string, size = 10, bold = false, gap = 4) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    for (const line of doc.splitTextToSize(text, width) as string[]) {
      if (y + size > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size * 1.3;
    }
    y += gap;
  };

  write(content.title, 18, true);
  write(content.subtitle, 11, false, 10);
  write(`${content.instructionsLead} ${content.instructions}`, 9, false, 10);
  for (const field of content.candidateFields) {
    write(`${field.label} ${answers[field.id]?.trim() || "—"}`);
  }
  write(`${content.candidateStatic.label} ${content.candidateStatic.value}`, 10, false, 12);

  for (const section of content.sections) {
    write(section.title, 13, true, 8);
    for (const question of section.questions) {
      write(`${question.label}  ${question.prompt}`, 11, true);
      if (question.hint) write(question.hint, 9);
      for (const part of question.parts) {
        for (const line of partLines(part, answers)) write(line, 10, false, 2);
      }
      y += 8;
    }
  }

  const { acknowledgment } = content;
  write(acknowledgment.title, 13, true);
  write(acknowledgment.text);
  write(`${acknowledgment.signature.label} ${answers[acknowledgment.signature.id]?.trim() || "—"}`);
  write(`${acknowledgment.date.label} ${answers[acknowledgment.date.id]?.trim() || "—"}`, 10, false, 12);
  write(content.footer, 8);

  doc.save("bookkeeping-skills-assessment.pdf");
}
