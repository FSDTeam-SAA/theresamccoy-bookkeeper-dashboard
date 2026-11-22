"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { NOT_CONNECTED } from "../constants";
import { useSettingsHydrated } from "../hooks/use-settings-hydrated";
import { personalInfoSchema, type PersonalInfoValues } from "../schema";
import { useSettingsStore } from "../store";
import {
  discardButton,
  fieldError,
  fieldInput,
  fieldLabel,
  saveButton,
  sectionTitle,
  settingsCard,
} from "./settings-styles";

const FIELDS: {
  name: keyof PersonalInfoValues;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: "email" | "tel";
}[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
];

/** Profile tab form (Figma 11380:12128). Saves on this device only. */
export function PersonalInfoForm() {
  const hydrated = useSettingsHydrated();
  const saved = useSettingsStore((state) => state.personalInfo);
  const savePersonalInfo = useSettingsStore((state) => state.savePersonalInfo);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: saved,
    mode: "onTouched",
  });

  // Swap in locally saved details once they have been read from storage.
  useEffect(() => {
    if (hydrated) form.reset(useSettingsStore.getState().personalInfo);
  }, [hydrated, form]);

  const onSubmit = (values: PersonalInfoValues) => {
    savePersonalInfo(values);
    form.reset(values);
    toast.success("Personal information saved on this device", {
      description: NOT_CONNECTED,
    });
  };

  const { isDirty, isSubmitting } = form.formState;

  return (
    <section aria-labelledby="personal-info-title" className={settingsCard}>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <h2 id="personal-info-title" className={sectionTitle}>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {FIELDS.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: control }) => (
                    <FormItem className="gap-2">
                      <FormLabel
                        className={cn(
                          fieldLabel,
                          "data-[error=true]:text-alert",
                        )}
                      >
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...control}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          inputMode={field.inputMode}
                          disabled={!hydrated}
                          className={fieldInput}
                        />
                      </FormControl>
                      <FormMessage className={fieldError} />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(saved)}
              disabled={!isDirty}
              className={discardButton}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={!hydrated || isSubmitting}
              className={saveButton}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
