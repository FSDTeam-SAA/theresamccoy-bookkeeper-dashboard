"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { otherDetailsSchema, type OtherDetailsValues } from "../schemas";
import { useProfileStore } from "../store";
import {
  SectionCard,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
  sectionButtonClass,
} from "./profile-ui";

type FieldConfig = {
  name: keyof OtherDetailsValues;
  label: string;
  inputMode?: "numeric" | "decimal";
  prefix?: string;
};

const ROW_ONE: FieldConfig[] = [
  {
    name: "hourlyRate",
    label: "Hourly rate",
    inputMode: "decimal",
    prefix: "$",
  },
  { name: "projectsDone", label: "Projects done", inputMode: "numeric" },
];
const ROW_TWO: FieldConfig[] = [
  {
    name: "experienceYears",
    label: "Experience in years",
    inputMode: "numeric",
  },
  { name: "languages", label: "Language Proficiency" },
  { name: "availability", label: "Availability" },
];

export function EditOtherSection() {
  const other = useProfileStore((state) => state.profile.other);
  const updateOther = useProfileStore((state) => state.updateOther);

  const form = useForm<OtherDetailsValues>({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      hourlyRate: String(other.hourlyRate),
      projectsDone: String(other.projectsDone),
      experienceYears: String(other.experienceYears),
      languages: other.languages,
      availability: other.availability,
    },
  });

  const onSubmit = (values: OtherDetailsValues) => {
    updateOther({
      hourlyRate: Number(values.hourlyRate),
      projectsDone: Number(values.projectsDone),
      experienceYears: Number(values.experienceYears),
      languages: values.languages,
      availability: values.availability,
    });
    form.reset(values);
    toast.success("Other details saved");
  };

  const renderField = (config: FieldConfig) => (
    <FormField
      key={config.name}
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem className="min-w-0 gap-3">
          <FormLabel className={fieldLabelClass}>{config.label}</FormLabel>
          <div className="relative">
            {config.prefix ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-onest text-[16px] font-light text-ink-400"
              >
                {config.prefix}
              </span>
            ) : null}
            <FormControl>
              <Input
                inputMode={config.inputMode}
                className={cn(fieldClass, config.prefix && "pl-7")}
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage className={fieldErrorClass} />
        </FormItem>
      )}
    />
  );

  return (
    <SectionCard title="Other Details" titleId="edit-other" className="gap-8">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ROW_ONE.map(renderField)}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ROW_TWO.map(renderField)}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="brand"
              aria-label="Add other details"
              className={sectionButtonClass}
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
    </SectionCard>
  );
}
