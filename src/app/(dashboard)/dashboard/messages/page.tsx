import type { Metadata } from "next";
import { Inbox } from "@/features/messages/components/inbox";

export const metadata: Metadata = {
  title: "Messages | Bookkeeper Dashboard",
};

export default function MessagesPage() {
  return <Inbox />;
}
