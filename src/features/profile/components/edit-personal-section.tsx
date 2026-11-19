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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { personalInfoSchema, type PersonalInfoValues } from "../schemas";
import { useProfileStore } from "../store";
import {
  SectionCard,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
  sectionButtonClass,
} from "./profile-ui";

const FIELDS: {
  name: Exclude<keyof PersonalInfoValues, "bio">;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { name: "fullName", label: "Full Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "location",
    label: "Location",
    type: "text",
    autoComplete: "address-level2",
  },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
];

export function EditPersonalSection() {
  const personal = useProfileStore((state) => state.profile.personal);
  const updatePersonal = useProfileStore((state) => state.updatePersonal);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personal,
  });

  const onSubmit = (values: PersonalInfoValues) => {
    updatePersonal(values);
    form.reset(values);
    toast.success("Personal information saved");
  };

  return (
    <SectionCard title="Personal Information" titleId="edit-personal">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FIELDS.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: input }) => (
                  <FormItem className="gap-3">
                    <FormLabel className={fieldLabelClass}>
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        autoComplete={field.autoComplete}
                        className={fieldClass}
                        {...input}
                      />
                    </FormControl>
                    <FormMessage className={fieldErrorClass} />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="gap-3">
                <FormLabel className={fieldLabelClass}>
                  Professional Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    className={cn(fieldClass, "min-h-[120px] resize-y")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className={fieldErrorClass} />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="brand"
              className={sectionButtonClass}
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </SectionCard>
  );
}
