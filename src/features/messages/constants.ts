import type { Conversation } from "./types";

/**
 * Copy transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk, node 11380:11948).
 * Only the Platform Support thread is drawn in full; the other threads hold the
 * single message their list preview shows. Static until a messaging API exists.
 */

export const MESSAGES_HREF = "/dashboard/messages";
export const conversationHref = (id: string) => `${MESSAGES_HREF}/${id}`;

export const COMPOSER_PLACEHOLDER = "Type a message…";

export const ICONS = {
  attach: "/images/messages/attach.svg",
  send: "/images/messages/send.svg",
  back: "/images/dashboard/arrow-up-line.svg",
} as const;

export const CONVERSATIONS: readonly Conversation[] = [
  {
    id: "platform-support",
    name: "Platform Support",
    subtitle: "Bookkeepers Marketplace",
    avatar: "/images/messages/platform-support.png",
    unread: true,
    messages: [
      {
        id: "ps-1",
        author: "contact",
        text: "Welcome to Bookkeepers Marketplace, Alex! Your application has been received.",
        time: "3 days ago",
      },
      {
        id: "ps-2",
        author: "me",
        text: "Thank you! When should I expect to hear back about my assessment?",
        time: "3 days ago",
      },
      {
        id: "ps-3",
        author: "contact",
        text: "Your profile is under review. We aim to respond within 48 hours.",
        time: "2 days ago",
      },
      {
        id: "ps-4",
        author: "contact",
        text: "Your profile has been reviewed. You are cleared for the Certified tier.",
        time: "2h ago",
      },
    ],
  },
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    subtitle: "Client · Luminary Co.",
    avatar: "/images/messages/sarah-mitchell.png",
    unread: false,
    messages: [
      {
        id: "sm-1",
        author: "contact",
        text: "Can you share the updated chart of accounts when ready?",
        time: "1d ago",
      },
    ],
  },
  {
    id: "james-foster",
    name: "James Foster",
    subtitle: "Elite Mentor",
    avatar: "/images/messages/james-foster.png",
    unread: false,
    messages: [
      {
        id: "jf-1",
        author: "contact",
        text: "Great progress on Module 3. Ready for your next session?",
        time: "3d ago",
      },
    ],
  },
];

export const DEFAULT_CONVERSATION_ID = CONVERSATIONS[0].id;

export const findConversation = (id: string) =>
  CONVERSATIONS.find((conversation) => conversation.id === id);
