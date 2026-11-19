"use client";

/* eslint-disable @next/next/no-img-element -- fixed-size Figma SVG assets */
import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  Answers,
  FactsPart,
  LongTextPart,
  MultipleChoicePart,
  Question,
  QuestionPart,
  StatementPart,
  StatementRow,
  TableCell,
  TableColumn,
  TableFillPart,
  TableRow,
  TextPart,
} from "../types";
import { tableCellId } from "../utils";

export type AnswerProps = {
  answers: Answers;
  onAnswer: (fieldId: string, value: string) => void;
};

const subLabel = "text-[16px] leading-[1.2] font-normal text-[#102a2b]";
const placeholderText = "placeholder:font-light placeholder:text-muted-text";

/* ---------- free text ---------- */

function LongTextField({ part, answers, onAnswer, fallbackLabel }: AnswerProps & {
  part: LongTextPart | TextPart;
  fallbackLabel: string;
}) {
  const id = useId();
  const multiline = part.kind === "long-text";
  const shared = {
    id,
    value: answers[part.id] ?? "",
    placeholder: part.placeholder,
    "aria-label": part.label ? undefined : fallbackLabel,
  };
  const fieldClass = cn(
    "w-full rounded-[8px] border border-[#e6e7e6] bg-transparent p-4 font-onest text-[16px] leading-[1.2] font-normal text-ink shadow-none md:text-[16px]",
    "focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-400/30",
    placeholderText,
  );

  return (
    <div className="flex flex-col gap-3">
      {part.label ? (
        <label htmlFor={id} className={subLabel}>
          {part.label}
        </label>
      ) : null}
      {multiline ? (
        <Textarea
          {...shared}
          onChange={(event) => onAnswer(part.id, event.target.value)}
          className={cn(fieldClass, "min-h-20")}
        />
      ) : (
        <input
          {...shared}
          type="text"
          onChange={(event) => onAnswer(part.id, event.target.value)}
          className={cn(fieldClass, "outline-none")}
        />
      )}
    </div>
  );
}

/* ---------- table fill ---------- */

const cellText: Record<NonNullable<TableColumn["variant"]>, string> = {
  default: "font-normal text-[#090f12]",
  index: "font-light text-[#4e4e4e]",
  muted: "font-light text-[#4e4e4e]",
};

const tableField =
  "w-full min-w-[120px] rounded-[4px] border border-[#d7d7d7] font-onest text-[14px] leading-[1.2] text-ink outline-none focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-400/30";

function TableCellContent({
  cell,
  fieldId,
  label,
  column,
  answers,
  onAnswer,
}: AnswerProps & {
  cell: TableCell;
  fieldId: string;
  label: string;
  column: TableColumn;
}) {
  if (cell === null) return null;
  if (typeof cell === "string") {
    return <span className={cellText[column.variant ?? "default"]}>{cell}</span>;
  }

  const value = answers[fieldId] ?? "";
  if (cell.input === "select") {
    return (
      <span className="relative block">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onAnswer(fieldId, event.target.value)}
          className={cn(
            tableField,
            "cursor-pointer appearance-none bg-brand-50 py-3 pr-10 pl-3 font-light",
            !value && "text-muted-text",
          )}
        >
          <option value="">{cell.placeholder}</option>
          {cell.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img
          src="/images/assessments/chevron-down.svg"
          alt=""
          width={16}
          height={16}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
      </span>
    );
  }

  return (
    <input
      type="text"
      aria-label={label}
      value={value}
      placeholder={cell.placeholder}
      onChange={(event) => onAnswer(fieldId, event.target.value)}
      className={cn(
        tableField,
        cell.placeholder
          ? cn("bg-brand-50 p-3 font-light", placeholderText)
          : "h-[33.5px] bg-[#e9e9e9] px-3",
      )}
    />
  );
}

function rowLabel(row: TableRow, columns: readonly TableColumn[]) {
  const labelColumn = columns.find(
    (column) => column.variant !== "index" && typeof row.cells[column.key] === "string",
  );
  return labelColumn ? (row.cells[labelColumn.key] as string) : row.id;
}

function TableFill({ part, answers, onAnswer }: AnswerProps & { part: TableFillPart }) {
  return (
    <div className="w-full overflow-x-auto rounded-[12px] border border-[#e6e7e6] bg-[#f9fbfa]">
      <table className="w-full min-w-[600px] table-fixed border-collapse font-onest text-[16px] leading-[1.2]">
        <caption className="sr-only">{part.caption}</caption>
        <colgroup>
          {part.columns.map((column) => (
            <col
              key={column.key}
              className={column.variant === "index" ? "w-[56px]" : undefined}
            />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-[#e6e7e6] bg-brand-50">
            {part.columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-3 py-4 font-normal text-[#4e4e4e] first:pl-6 last:pr-6",
                  column.align === "center" ? "text-center" : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {part.rows.map((row) => {
            const label = rowLabel(row, part.columns);
            const strong = row.variant === "strong";
            return (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-[#e6e7e6] last:border-b-0",
                  row.variant && row.variant !== "default" && "bg-brand-50",
                )}
              >
                {part.columns.map((column) => {
                  const header = column.header || part.caption;
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        "px-3 py-3 align-middle first:pl-6 last:pr-6",
                        column.align === "center" ? "text-center" : "text-left",
                        strong && "[&>span]:font-medium [&>span]:text-[#102a2b]",
                      )}
                    >
                      <TableCellContent
                        cell={row.cells[column.key] ?? null}
                        fieldId={tableCellId(part.id, row.id, column.key)}
                        label={`${label} — ${header}`}
                        column={column}
                        answers={answers}
                        onAnswer={onAnswer}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- read-only P&L ---------- */

const statementRow: Record<StatementRow["variant"], string> = {
  section: "bg-brand-50 font-medium text-[#102a2b]",
  line: "border-b border-[#e6e7e6] font-light text-ink",
  anomaly: "border-b border-[#e6e7e6] bg-[#f9ece7] font-light text-alert",
  total: "border-b border-[#e6e7e6] font-medium text-[#102a2b]",
  "grand-total": "bg-brand-50 font-medium text-[#102a2b]",
};

function Statement({ part }: { part: StatementPart }) {
  return (
    <div className="w-full overflow-x-auto rounded-[6px] border border-[#e6e7e6]">
      <table className="w-full min-w-[320px] border-collapse font-onest text-[16px] leading-[1.2]">
        <caption className="sr-only">{part.caption}</caption>
        <tbody>
          {part.rows.map((row) =>
            row.variant === "section" ? (
              <tr key={row.label} className={statementRow.section}>
                <th scope="colgroup" colSpan={2} className="p-3 text-left font-medium">
                  {row.label}
                </th>
              </tr>
            ) : (
              <tr key={row.label} className={statementRow[row.variant]}>
                <th scope="row" className="p-3 text-left font-[inherit]">
                  {row.label}
                </th>
                <td className="p-3 text-right">{row.amount}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- facts box ---------- */

function Facts({ part }: { part: FactsPart }) {
  return (
    <ul className="w-full rounded-[8px] border border-brand-50 bg-brand-50 p-4 text-[16px] leading-[1.5] font-normal text-[#102a2b]">
      {part.lines.map((line) => (
        <li key={line}>
          <span aria-hidden="true">• </span>
          {line}
        </li>
      ))}
    </ul>
  );
}

/* ---------- multiple choice ---------- */

function MultipleChoice({
  part,
  legend,
  answers,
  onAnswer,
}: AnswerProps & { part: MultipleChoicePart; legend: string }) {
  const name = useId();
  const selected = answers[part.id] ?? "";

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="sr-only">{legend}</legend>
      {part.options.map((option) => {
        const checked = selected === option;
        return (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-[6px] border p-4 transition-colors",
              "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand-400/30",
              checked ? "border-brand-400 bg-brand-50/60" : "border-[#e6e7e6] hover:bg-brand-50/40",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onAnswer(part.id, option)}
              className="sr-only"
            />
            <span className="relative flex size-5 shrink-0 items-center justify-center">
              <img src="/images/assessments/radio.svg" alt="" width={20} height={20} />
              {checked ? (
                <span className="absolute size-[9px] rounded-full bg-brand-800" aria-hidden="true" />
              ) : null}
            </span>
            <span className="flex-1 text-[16px] leading-[1.2] font-normal text-ink">{option}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

/* ---------- question ---------- */

function Part({ part, question, ...answerProps }: AnswerProps & {
  part: QuestionPart;
  question: Question;
}) {
  const heading = `${question.label}: ${question.prompt}`;
  switch (part.kind) {
    case "text":
    case "long-text":
      return <LongTextField part={part} fallbackLabel={heading} {...answerProps} />;
    case "table-fill":
      return <TableFill part={part} {...answerProps} />;
    case "multiple-choice":
      return <MultipleChoice part={part} legend={heading} {...answerProps} />;
    case "statement":
      return <Statement part={part} />;
    case "facts":
      return <Facts part={part} />;
    case "note":
      return <p className="text-[12px] leading-[1.2] font-light text-alert">{part.text}</p>;
  }
}

export function QuestionBlock({ question, ...answerProps }: AnswerProps & { question: Question }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 leading-[1.2]">
        <h3 className="flex flex-col gap-1 text-[18px] font-medium sm:flex-row sm:gap-3">
          <span className="shrink-0 whitespace-nowrap text-brand-800">{question.label}</span>
          <span className="min-w-0 flex-1 text-[#102a2b]">{question.prompt}</span>
        </h3>
        {question.hint ? (
          <p className="text-[12px] font-light text-brand-800">{question.hint}</p>
        ) : null}
      </div>
      {question.parts.map((part, index) => (
        <Part key={index} part={part} question={question} {...answerProps} />
      ))}
    </div>
  );
}
