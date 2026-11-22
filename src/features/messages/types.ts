export type MessageAuthor = "contact" | "me";

export type Message = {
  id: string;
  author: MessageAuthor;
  text: string;
  /** Static relative label from the design (e.g. "2h ago"). */
  time?: string;
  /** ISO timestamp for messages sent in this browser. */
  sentAt?: string;
};

export type Conversation = {
  id: string;
  name: string;
  /** Role or organisation shown under the name. */
  subtitle: string;
  avatar: string;
  /** Unread on first visit, until the thread is opened. */
  unread: boolean;
  messages: Message[];
};
