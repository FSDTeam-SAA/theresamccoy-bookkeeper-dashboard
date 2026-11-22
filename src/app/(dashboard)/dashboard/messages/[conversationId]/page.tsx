import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inbox } from "@/features/messages/components/inbox";
import { CONVERSATIONS, findConversation } from "@/features/messages/constants";

type Params = { conversationId: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CONVERSATIONS.map(({ id }) => ({ conversationId: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { conversationId } = await params;
  const conversation = findConversation(conversationId);
  return {
    title: `${conversation?.name ?? "Messages"} | Bookkeeper Dashboard`,
  };
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { conversationId } = await params;
  if (!findConversation(conversationId)) notFound();

  return <Inbox conversationId={conversationId} />;
}
