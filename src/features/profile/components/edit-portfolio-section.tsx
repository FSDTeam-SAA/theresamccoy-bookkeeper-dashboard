"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PROFILE_ICONS } from "../constants";
import { portfolioSchema, type PortfolioValues } from "../schemas";
import { createId, useProfileStore } from "../store";
import { RemoveRowButton, RowControls } from "./edit-row-controls";
import {
  ProfileIcon,
  SectionCard,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
} from "./profile-ui";

const TEXT_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Sub-title" },
  { key: "department", label: "Department" },
] as const;

const gridClass =
  "grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_120px] md:gap-5";

function PdfUploadButton({
  index,
  fileName,
  onSelect,
}: {
  index: number;
  fileName?: string;
  onSelect: (fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      toast.error("Please choose a PDF file.");
      return;
    }
    onSelect(file.name);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className={cn(fieldLabelClass, "md:sr-only")} aria-hidden="true">
        Pdf File
      </span>
      <Button
        type="button"
        variant="outline"
        aria-label={
          fileName
            ? `Replace PDF for portfolio item ${index + 1} (${fileName})`
            : `Upload PDF for portfolio item ${index + 1}`
        }
        title={fileName}
        onClick={() => inputRef.current?.click()}
        className="h-auto w-full rounded-[8px] border-[rgba(6,50,49,0.42)] bg-white p-4 shadow-none hover:bg-brand-50 md:w-[120px]"
      >
        <ProfileIcon src={PROFILE_ICONS.pdfUpload} size={19} />
      </Button>
      {fileName ? (
        <span className="truncate font-onest text-[12px] font-light text-[#6a6a6a]">
          {fileName}
        </span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-label={`PDF file for portfolio item ${index + 1}`}
        onChange={onChange}
      />
    </div>
  );
}

export function EditPortfolioSection() {
  const portfolio = useProfileStore((state) => state.profile.portfolio);
  const setPortfolio = useProfileStore((state) => state.setPortfolio);

  const form = useForm<PortfolioValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: { portfolio },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "portfolio",
    keyName: "key",
  });
  const rows = useWatch({ control: form.control, name: "portfolio" });

  const onSubmit = (values: PortfolioValues) => {
    setPortfolio(values.portfolio);
    form.reset(values);
    toast.success("Portfolio saved");
  };

  return (
    <SectionCard title="Portfolio" titleId="edit-portfolio">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div
            aria-hidden="true"
            className={cn(fieldLabelClass, gridClass, "hidden md:grid")}
          >
            {TEXT_COLUMNS.map((col) => (
              <span key={col.key}>{col.label}</span>
            ))}
            <span>Pdf File</span>
          </div>
          {fields.map((row, index) => (
            <div
              key={row.key}
              className="flex flex-col gap-1.5 border-b border-[#f2f2f2] pb-4 last:border-b-0 last:pb-0 md:border-b-0 md:pb-0"
            >
              <div className={cn(gridClass, "items-start")}>
                {TEXT_COLUMNS.map((col) => (
                  <FormField
                    key={col.key}
                    control={form.control}
                    name={`portfolio.${index}.${col.key}`}
                    render={({ field }) => (
                      <FormItem className="min-w-0 gap-1.5">
                        <FormLabel
                          className={cn(fieldLabelClass, "md:sr-only")}
                        >
                          {col.label}
                          <span className="sr-only">
                            {" "}
                            (portfolio item {index + 1})
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input className={fieldClass} {...field} />
                        </FormControl>
                        <FormMessage className={fieldErrorClass} />
                      </FormItem>
                    )}
                  />
                ))}
                <PdfUploadButton
                  index={index}
                  fileName={rows?.[index]?.fileName}
                  onSelect={(fileName) =>
                    form.setValue(`portfolio.${index}.fileName`, fileName, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
              <RemoveRowButton
                label={`Remove portfolio item ${index + 1}`}
                onClick={() => remove(index)}
              />
            </div>
          ))}
          <RowControls
            addRowLabel="Add portfolio row"
            saveLabel="Add portfolio"
            onAddRow={() =>
              append({
                id: createId("portfolio"),
                title: "",
                description: "",
                department: "",
              })
            }
          />
        </form>
      </Form>
    </SectionCard>
  );
}
