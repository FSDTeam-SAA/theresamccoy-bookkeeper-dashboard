"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLogo } from "./brand-logo";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mist font-onest lg:flex">
      <aside className="hidden w-[386px] shrink-0 bg-brand-50 lg:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          <DashboardSidebar />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50 px-4 py-2 lg:hidden">
        <BrandLogo className="h-[60px] w-[68px]" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open navigation"
            className="rounded-md p-2 text-brand-900 hover:bg-brand-900/5"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto bg-brand-50 p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <DashboardSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
