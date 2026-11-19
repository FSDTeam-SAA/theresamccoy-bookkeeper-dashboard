"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { certificationsSchema, type CertificationsValues } from "../schemas";
import { createId, useProfileStore } from "../store";
import { RemoveRowButton, RowControls } from "./edit-row-controls";
import {
  SectionCard,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
} from "./profile-ui";

export function EditCertificationsSection() {
  const certificates = useProfileStore((state) => state.profile.certificates);
  const setCertificates = useProfileStore((state) => state.setCertificates);

  const form = useForm<CertificationsValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: { certificates },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certificates",
    keyName: "key",
  });

  const onSubmit = (values: CertificationsValues) => {
    setCertificates(values.certificates);
    form.reset(values);
    toast.success("Certifications saved");
  };

  return (
    <SectionCard title="Certification" titleId="edit-certification">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div
            aria-hidden="true"
            className={cn(fieldLabelClass, "flex gap-3 sm:gap-5")}
          >
            <span className="flex-1">Title</span>
            <span className="w-[96px] sm:w-[180px]">Year</span>
          </div>
          {fields.map((row, index) => (
            <div key={row.key} className="flex flex-col gap-1.5">
              <div className="flex items-start gap-3 sm:gap-5">
                <FormField
                  control={form.control}
                  name={`certificates.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="min-w-0 flex-1 gap-1.5">
                      <FormLabel className="sr-only">
                        Certification {index + 1} title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Certification title"
                          className={fieldClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={fieldErrorClass} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certificates.${index}.year`}
                  render={({ field }) => (
                    <FormItem className="w-[96px] shrink-0 gap-1.5 sm:w-[180px]">
                      <FormLabel className="sr-only">
                        Certification {index + 1} year
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="YYYY"
                          className={cn(fieldClass, "text-center")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={fieldErrorClass} />
                    </FormItem>
                  )}
                />
              </div>
              <RemoveRowButton
                label={`Remove certification ${index + 1}`}
                onClick={() => remove(index)}
              />
            </div>
          ))}
          <RowControls
            addRowLabel="Add certification row"
            saveLabel="Add certifications"
            onAddRow={() =>
              append({ id: createId("cert"), title: "", year: "" })
            }
          />
        </form>
      </Form>
    </SectionCard>
  );
}
