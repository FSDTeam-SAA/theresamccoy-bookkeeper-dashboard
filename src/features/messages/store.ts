import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Message } from "./types";

/**
 * Persisted inbox state until the messaging API exists: messages sent from
 * this browser (appended after the seeded thread) and which threads were read.
 */
type MessagesState = {
  /** conversation id -> messages sent locally. */
  sent: Record<string, Message[]>;
  /** conversation id -> ISO timestamp it was last opened. */
  readAt: Record<string, string>;
  sendMessage: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSentMessage = (value: unknown): value is Message =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.author === "me" &&
  typeof value.text === "string" &&
  typeof value.sentAt === "string";

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set) => ({
      sent: {},
      readAt: {},
      sendMessage: (conversationId, text) =>
        set((state) => {
          const sentAt = new Date().toISOString();
          const message: Message = {
            id: `${conversationId}-${Date.now()}`,
            author: "me",
            text,
            sentAt,
          };
          return {
            sent: {
              ...state.sent,
              [conversationId]: [
                ...(state.sent[conversationId] ?? []),
                message,
              ],
            },
            readAt: { ...state.readAt, [conversationId]: sentAt },
          };
        }),
      markRead: (conversationId) =>
        set((state) =>
          state.readAt[conversationId]
            ? state
            : {
                readAt: {
                  ...state.readAt,
                  [conversationId]: new Date().toISOString(),
                },
              },
        ),
    }),
    {
      name: "bookkeeper-messages",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ sent, readAt }) => ({ sent, readAt }),
      // Drop anything malformed from an older or hand-edited saved state.
      merge: (persisted, current) => {
        const saved = isRecord(persisted) ? persisted : {};
        const sent: Record<string, Message[]> = {};
        const readAt: Record<string, string> = {};
        if (isRecord(saved.sent)) {
          for (const [id, messages] of Object.entries(saved.sent)) {
            if (Array.isArray(messages))
              sent[id] = messages.filter(isSentMessage);
          }
        }
        if (isRecord(saved.readAt)) {
          for (const [id, at] of Object.entries(saved.readAt)) {
            if (typeof at === "string") readAt[id] = at;
          }
        }
        return { ...current, sent, readAt };
      },
    },
  ),
);
