"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { differenceInSeconds, formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  COMPOSER_PLACEHOLDER,
  CONVERSATIONS,
  DEFAULT_CONVERSATION_ID,
  ICONS,
  MESSAGES_HREF,
  conversationHref,
  findConversation,
} from "../constants";
import { useMessagesHydrated } from "../hooks/use-messages-hydrated";
import { useMessagesStore } from "../store";
import type { Conversation, Message } from "../types";

const EMPTY: Message[] = [];
const MAX_LENGTH = 2000;
const LG_QUERY = "(min-width: 1024px)";

function timeLabel(message: Message) {
  if (message.time) return message.time;
  if (!message.sentAt) return "";
  const sentAt = new Date(message.sentAt);
  return differenceInSeconds(new Date(), sentAt) < 60
    ? "Just now"
    : formatDistanceToNowStrict(sentAt, { addSuffix: true });
}

/** Seeded messages plus anything sent from this browser, and unread state. */
function useThread(conversation: Conversation) {
  const hydrated = useMessagesHydrated();
  const sent = useMessagesStore(
    (state) => state.sent[conversation.id] ?? EMPTY,
  );
  const readAt = useMessagesStore((state) => state.readAt[conversation.id]);

  const messages = useMemo(
    () =>
      hydrated ? [...conversation.messages, ...sent] : conversation.messages,
    [conversation.messages, hydrated, sent],
  );
  return {
    hydrated,
    messages,
    lastMessage: messages[messages.length - 1],
    unread: conversation.unread && !(hydrated && readAt),
  };
}

/* ---------- conversation list ---------- */

function ConversationRow({
  conversation,
  active,
}: {
  conversation: Conversation;
  active: boolean;
}) {
  const { lastMessage, unread } = useThread(conversation);
  const metaColor = active ? "text-[#536467]" : "text-muted-text";

  return (
    <li>
      <Link
        href={conversationHref(conversation.id)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-start gap-2 border-l-2 py-4 pr-5 pl-[18px] outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40 focus-visible:ring-inset",
          active
            ? "border-brand-900 border-b border-b-[#e6ebea] bg-brand-50"
            : "border-transparent hover:bg-brand-50/60",
        )}
      >
        <Image
          src={conversation.avatar}
          width={60}
          height={60}
          alt=""
          className="size-[60px] shrink-0 rounded-full object-cover"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.2]">
          <span className="flex flex-col gap-[2px]">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[16px] font-normal text-[#102a2b]">
                {conversation.name}
              </span>
              <span
                className={cn("shrink-0 text-[12px] font-light", metaColor)}
              >
                {lastMessage ? timeLabel(lastMessage) : null}
              </span>
            </span>
            <span className={cn("truncate text-[12px] font-light", metaColor)}>
              {conversation.subtitle}
            </span>
          </span>
          <span
            className={cn(
              "truncate text-[14px]",
              unread
                ? "font-normal text-[#102a2b]"
                : cn("font-light", metaColor),
            )}
          >
            {lastMessage?.author === "me" ? "You: " : null}
            {lastMessage?.text}
          </span>
        </span>
        {unread ? (
          <span className="flex shrink-0 pt-[6px]">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-brand-900"
            />
            <span className="sr-only">Unread</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function ConversationList({ activeId }: { activeId?: string }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = CONVERSATIONS.filter(
    (conversation) =>
      !needle ||
      [
        conversation.name,
        conversation.subtitle,
        ...conversation.messages.map((m) => m.text),
      ].some((field) => field.toLowerCase().includes(needle)),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-[#e6ebea] px-5 pt-5 pb-[21px]">
        <h1 className="text-[28px] leading-[1.2] font-medium text-brand-900 sm:text-[32px]">
          Messages
        </h1>
      </div>
      <div className="border-b border-[#e6ebea] px-5 py-3">
        <label htmlFor={searchId} className="sr-only">
          Search conversations
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations"
          className="h-10 w-full rounded-full border border-[#c3c3c3] bg-white px-4 text-[14px] leading-[1.2] font-light text-ink outline-none placeholder:text-[#4d4d4d] focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-400/40"
        />
      </div>
      <nav
        aria-label="Conversations"
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {visible.length ? (
          <ul>
            {visible.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeId}
              />
            ))}
          </ul>
        ) : (
          <p role="status" className="px-5 py-6 text-[14px] text-muted-text">
            No conversations match “{query.trim()}”.
          </p>
        )}
      </nav>
    </div>
  );
}

/* ---------- thread ---------- */

function MessageBubble({
  message,
  avatar,
}: {
  message: Message;
  avatar: string;
}) {
  const mine = message.author === "me";
  const time = timeLabel(message);

  return (
    <li
      className={cn(
        "flex w-full gap-[10px]",
        mine ? "justify-end" : "items-end",
      )}
    >
      {mine ? null : (
        <Image
          src={avatar}
          width={30}
          height={30}
          alt=""
          className="mb-[18px] size-[30px] shrink-0 rounded-full object-cover"
        />
      )}
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]",
          mine ? "items-end" : "items-start",
        )}
      >
        <p
          className={cn(
            "text-[15px] leading-[1.2] font-light break-words whitespace-pre-wrap sm:text-[16px]",
            mine
              ? "rounded-[14px_14px_4px_14px] bg-brand-900 px-[14px] py-[10px] text-mist"
              : "rounded-[14px_14px_14px_4px] border border-[#eff1f1] bg-white px-[15px] py-[11px] text-[#102a2b]",
          )}
        >
          <span className="sr-only">{mine ? "You: " : null}</span>
          {message.text}
        </p>
        {time ? (
          <p
            className={cn(
              "text-[12px] leading-[1.2] font-light text-muted-text",
              mine && "text-right",
            )}
          >
            {time}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function Composer({ conversation }: { conversation: Conversation }) {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const text = draft.trim();

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!text) return;
    sendMessage(conversation.id, text);
    setDraft("");
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex shrink-0 items-center gap-[10px] border-t border-[#d5e4e3] bg-white px-4 pt-[17px] pb-4 sm:px-6"
    >
      <button
        type="button"
        aria-label="Attach a file"
        onClick={() => toast.info("Attachments are coming soon")}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-text outline-none hover:bg-mist focus-visible:ring-[3px] focus-visible:ring-brand-400/40 lg:size-8"
      >
        <Image src={ICONS.attach} width={16} height={16} alt="" />
      </button>
      <label htmlFor={inputId} className="sr-only">
        Message {conversation.name}
      </label>
      <Textarea
        id={inputId}
        ref={inputRef}
        rows={1}
        value={draft}
        maxLength={MAX_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={COMPOSER_PLACEHOLDER}
        aria-describedby={`${inputId}-hint`}
        className="max-h-40 min-h-0 flex-1 resize-none rounded-[32px] border-[#c3c3c3] bg-white p-4 font-onest text-[16px] leading-[1.2] font-light text-ink shadow-none placeholder:text-[#4d4d4d] focus-visible:border-brand-400 focus-visible:ring-brand-400/40 md:text-[16px]"
      />
      <span id={`${inputId}-hint`} className="sr-only">
        Press Enter to send, Shift plus Enter for a new line.
      </span>
      <button
        type="submit"
        aria-label="Send message"
        disabled={!text}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-900 outline-none hover:bg-brand-800 focus-visible:ring-[3px] focus-visible:ring-brand-400/40 disabled:cursor-not-allowed disabled:opacity-60 lg:size-[38px]"
      >
        <Image src={ICONS.send} width={20} height={20} alt="" />
      </button>
    </form>
  );
}

function Thread({
  conversation,
  isDefaultView,
}: {
  conversation: Conversation;
  isDefaultView: boolean;
}) {
  const { hydrated, messages } = useThread(conversation);
  const markRead = useMessagesStore((state) => state.markRead);
  const endRef = useRef<HTMLLIElement>(null);
  const titleId = useId();

  // Clear the unread dot once the thread is actually on screen. On the bare
  // /messages route the default thread is only visible from lg upwards.
  useEffect(() => {
    if (!hydrated) return;
    if (isDefaultView && !window.matchMedia(LG_QUERY).matches) return;
    markRead(conversation.id);
  }, [conversation.id, hydrated, isDefaultView, markRead]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <section aria-labelledby={titleId} className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#d5e4e3] bg-brand-50 px-4 pt-5 pb-[21px] sm:px-5">
        <Link
          href={MESSAGES_HREF}
          aria-label="Back to conversations"
          className="-ml-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-text outline-none hover:bg-brand-900/5 focus-visible:ring-[3px] focus-visible:ring-brand-400/40 lg:hidden"
        >
          <MaskIcon src={ICONS.back} className="-rotate-90" />
        </Link>
        <Image
          src={conversation.avatar}
          width={70}
          height={70}
          alt=""
          className="size-14 shrink-0 rounded-full object-cover sm:size-[70px]"
        />
        <div className="flex min-w-0 flex-col gap-2 leading-[1.2]">
          <h2
            id={titleId}
            className="truncate text-[24px] font-medium text-brand-900 sm:text-[32px]"
          >
            {conversation.name}
          </h2>
          <p className="truncate text-[16px] font-light text-muted-text sm:text-[20px]">
            {conversation.subtitle}
          </p>
        </div>
      </header>

      <ol
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={`Conversation with ${conversation.name}`}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            avatar={conversation.avatar}
          />
        ))}
        <li ref={endRef} aria-hidden="true" className="h-0 shrink-0" />
      </ol>

      <Composer key={conversation.id} conversation={conversation} />
    </section>
  );
}

/**
 * Inbox (Figma 11380:11948). From lg up the list and thread sit side by side;
 * below lg `/messages` shows the list and `/messages/[id]` shows the thread.
 */
export function Inbox({ conversationId }: { conversationId?: string }) {
  const conversation = findConversation(
    conversationId ?? DEFAULT_CONVERSATION_ID,
  )!;
  const threadOpen = Boolean(conversationId);

  return (
    <div className="flex h-[calc(100dvh-77px)] min-h-[480px] lg:h-dvh">
      <div
        className={cn(
          "w-full shrink-0 flex-col bg-mist lg:flex lg:w-[340px]",
          threadOpen ? "hidden" : "flex",
        )}
      >
        <ConversationList activeId={conversation.id} />
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 flex-col bg-mist lg:flex lg:border-l lg:border-[#b2bfbf]",
          threadOpen ? "flex" : "hidden",
        )}
      >
        <Thread conversation={conversation} isDefaultView={!threadOpen} />
      </div>
    </div>
  );
}
