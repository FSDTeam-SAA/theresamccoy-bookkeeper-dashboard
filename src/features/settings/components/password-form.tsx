"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { NOT_CONNECTED, PASSWORD_MIN_LENGTH } from "../constants";
import { passwordSchema, type PasswordValues } from "../schema";
import { PasswordInput } from "./password-input";
import {
  discardButton,
  fieldError,
  fieldLabel,
  saveButton,
  sectionTitle,
  settingsCard,
} from "./settings-styles";

const EMPTY: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Password tab form (Figma 11380:12060). Validates locally; values live only
 * in form state and are cleared after submit — nothing is persisted.
 */
export function PasswordForm() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });

  const onSubmit = () => {
    form.reset(EMPTY);
    toast.info("Password changes aren’t available yet", {
      description: NOT_CONNECTED,
    });
  };

  const label = cn(fieldLabel, "data-[error=true]:text-alert");

  return (
    <section aria-labelledby="password-settings-title" className={settingsCard}>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <h2 id="password-settings-title" className={sectionTitle}>
              Password Settings
            </h2>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel className={label}>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        autoComplete="current-password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage className={fieldError} />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel className={label}>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          autoComplete="new-password"
                          placeholder="********"
                          revealLabel="new password"
                        />
                      </FormControl>
                      <FormDescription className="font-onest text-[14px] leading-[1.3] text-[#6c757d]">
                        At least {PASSWORD_MIN_LENGTH} characters with an
                        uppercase letter, a lowercase letter and a number.
                      </FormDescription>
                      <FormMessage className={fieldError} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel className={label}>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          autoComplete="new-password"
                          placeholder="********"
                          revealLabel="confirm password"
                        />
                      </FormControl>
                      <FormMessage className={fieldError} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(EMPTY)}
              disabled={!form.formState.isDirty}
              className={discardButton}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={form.formState.isSubmitting}
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
