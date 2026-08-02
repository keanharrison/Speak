"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import { Menu, Mic, SquarePen, X } from "lucide-react";
import { useTabBarVisibility } from "@/components/layout/TabBarVisibility";
import { VoiceNotePanel } from "@/features/ask/VoiceNotePanel";
import type { AskMessage, AskPageContent, AskSuggestion } from "@/types";

type AskViewProps = {
  data: AskPageContent;
};

function greetingForTopic(template: string, topic: string): string {
  return template.replace("{topic}", topic);
}

function initialMessages(
  data: AskPageContent,
  chatId: string | null,
  aboutTopic: string | null,
): AskMessage[] {
  if (chatId) {
    const past = data.pastChats.find((chat) => chat.id === chatId);
    if (past) return past.messages.map((message) => ({ ...message }));
  }
  if (!aboutTopic) return data.messages;
  return [
    {
      role: "speak",
      body: greetingForTopic(data.aboutGreeting, aboutTopic),
    },
  ];
}

function chatTitleForId(data: AskPageContent, chatId: string | null) {
  if (!chatId) return null;
  return data.pastChats.find((chat) => chat.id === chatId)?.title ?? null;
}

/**
 * Speak chat — suggested questions + thread.
 * Composer pinned to bottom; native mobile keyboard (no custom SoftKeyboard).
 */
export function AskView({ data }: AskViewProps) {
  const searchParams = useSearchParams();
  const aboutTopic = searchParams.get("about")?.trim() || null;
  const chatId = searchParams.get("chat")?.trim() || null;

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AskMessage[]>(() =>
    initialMessages(data, chatId, aboutTopic),
  );
  const [threadTitle, setThreadTitle] = useState<string | null>(() =>
    chatTitleForId(data, chatId),
  );
  const [composerFocused, setComposerFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const { setTabBarVisible } = useTabBarVisibility();
  const lastAboutRef = useRef<string | null>(aboutTopic);
  const lastChatRef = useRef<string | null>(chatId);

  const showSuggestions = messages.length === 0 && !composerFocused;

  useEffect(() => {
    if (chatId === lastChatRef.current) return;
    lastChatRef.current = chatId;
    if (chatId) {
      const past = data.pastChats.find((chat) => chat.id === chatId);
      if (past) {
        setMessages(past.messages.map((message) => ({ ...message })));
        setThreadTitle(past.title);
      }
    }
  }, [chatId, data.pastChats]);

  useEffect(() => {
    if (aboutTopic === lastAboutRef.current) return;
    lastAboutRef.current = aboutTopic;
    if (aboutTopic && !chatId) {
      setThreadTitle(null);
      setMessages([
        {
          role: "speak",
          body: greetingForTopic(data.aboutGreeting, aboutTopic),
        },
      ]);
    }
  }, [aboutTopic, chatId, data.aboutGreeting]);

  useEffect(() => {
    setTabBarVisible(!composerFocused && !voiceNoteOpen);
    return () => setTabBarVisible(true);
  }, [composerFocused, voiceNoteOpen, setTabBarVisible]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function blurComposer() {
    inputRef.current?.blur();
    setComposerFocused(false);
  }

  function focusComposer() {
    inputRef.current?.focus();
    setComposerFocused(true);
  }

  function replyForQuestion(question: string): string {
    const match = data.suggestions.find(
      (suggestion) =>
        suggestion.title.toLowerCase() === question.trim().toLowerCase(),
    );
    return match?.reply ?? data.defaultReply;
  }

  function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", body: trimmed },
      { role: "speak", body: replyForQuestion(trimmed) },
    ]);
    setDraft("");
    blurComposer();
  }

  function handleReturn() {
    sendQuestion(draft);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendQuestion(draft);
  }

  function selectSuggestion(suggestion: AskSuggestion) {
    sendQuestion(suggestion.title);
  }

  function startNewChat() {
    setMessages([]);
    setDraft("");
    setThreadTitle(null);
    setSidebarOpen(false);
    blurComposer();
  }

  function openPastChat(id: string) {
    const chat = data.pastChats.find((item) => item.id === id);
    if (!chat) return;
    setMessages(chat.messages.map((message) => ({ ...message })));
    setThreadTitle(chat.title);
    setSidebarOpen(false);
    blurComposer();
  }

  return (
    <main
      className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-transparent"
      style={{
        paddingTop: "max(2.25rem, calc(var(--speak-page-safe-top) + 0.65rem))",
      }}
    >
      {/* Spacer matches Home “← Back” row so titles share one plane */}
      <div className="min-h-[44px] shrink-0 px-5" aria-hidden />
      <div className="relative mx-5 mb-5 shrink-0">
        <h1 className="page-title mt-2 text-center">Speak</h1>
        {threadTitle ? (
          <p className="mt-0.5 text-center text-[11px] text-[#6b6b6b]">
            Continuing
          </p>
        ) : null}
        <button
          type="button"
          aria-label="Open previous chats"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-0 top-2 flex size-7 items-center justify-center text-[#0A0A0A]"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="New chat"
          onClick={startNewChat}
          className="absolute right-0 top-2 flex size-7 items-center justify-center text-[#0A0A0A]"
        >
          <SquarePen className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-5">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center px-4 text-center">
            <BaileyAvatar size="lg" className="mb-4" />
            <p className="text-[15px] font-medium text-[#0A0A0A]">
              Ask about Bailey&apos;s results
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-4 pt-2">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}-${message.body.slice(0, 16)}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[18px] px-4 py-3 ${
                      isUser
                        ? "glass-light-button text-white"
                        : "glass-panel text-[#0A0A0A]"
                    }`}
                  >
                    {!isUser ? (
                      <p className="mb-1 text-[12px] font-medium text-[#6b6b6b]">
                        Speak
                      </p>
                    ) : null}
                    <p className="text-[15px] leading-relaxed">{message.body}</p>
                  </div>
                </div>
              );
            })}
            <div ref={threadEndRef} />
          </div>
        )}

        {showSuggestions ? (
          <div className="pb-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {data.suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="glass-panel flex min-h-[56px] items-center justify-center px-3 py-3 text-center"
                >
                  <p className="text-[13px] font-semibold leading-snug text-[#0A0A0A]">
                    {suggestion.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Composer — pinned to bottom; OS keyboard on real devices */}
      {!voiceNoteOpen ? (
        <div className="relative z-30 shrink-0 bg-transparent px-5 pb-[4.25rem] pt-1">
          <form onSubmit={handleSubmit}>
            <div
              className="glass-panel relative flex min-h-[48px] cursor-text items-center gap-2 px-3 py-2"
              onClick={focusComposer}
            >
              {!draft ? (
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  {composerFocused ? (
                    <span className="typing-caret" aria-hidden />
                  ) : null}
                  <span className="text-[15px] text-[#A3A3A3]">
                    {data.inputPlaceholder}
                  </span>
                </div>
              ) : null}
              <input
                ref={inputRef}
                type="text"
                value={draft}
                aria-label={data.inputPlaceholder}
                autoComplete="off"
                enterKeyHint="send"
                onFocus={() => {
                  setComposerFocused(true);
                }}
                onBlur={() => {
                  window.setTimeout(() => {
                    if (document.activeElement !== inputRef.current) {
                      setComposerFocused(false);
                    }
                  }, 0);
                }}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleReturn();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    blurComposer();
                  }
                }}
                className={`h-full min-w-0 flex-1 bg-transparent pl-1 text-left text-[15px] text-[#0A0A0A] outline-none ${
                  draft ? "" : "caret-transparent"
                }`}
              />
              <button
                type="button"
                aria-label="Voice note"
                onClick={(event) => {
                  event.stopPropagation();
                  blurComposer();
                  setVoiceNoteOpen(true);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-white"
              >
                <Mic className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <VoiceNotePanel
        open={voiceNoteOpen}
        onClose={() => setVoiceNoteOpen(false)}
        onSend={(label) => {
          setMessages((prev) => [
            ...prev,
            { role: "user", body: label },
            {
              role: "speak",
              body: "Got your voice note — in the full product we'll transcribe it. For now, try a typed question about Bailey's results.",
            },
          ]);
        }}
      />

      {sidebarOpen ? (
        <div className="absolute inset-0 z-50">
          <button
            type="button"
            aria-label="Dismiss sidebar"
            className="absolute inset-0 bg-black/35"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[78%] max-w-[300px] flex-col overflow-hidden rounded-r-[24px] bg-[rgba(255,255,255,0.92)] pt-10 shadow-[4px_0_24px_rgba(0,0,0,0.12)] backdrop-blur-[32px]">
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <p className="text-[15px] font-semibold text-[#0A0A0A]">
                {data.pastChatsHeading}
              </p>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-[#0A0A0A]"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              className="glass-light-button mx-4 mb-3 flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold"
            >
              <SquarePen className="h-4 w-4" strokeWidth={2} />
              New chat
            </button>

            <ul className="scrollbar-hide flex-1 overflow-y-auto px-2 pb-6">
              {data.pastChats.map((chat) => (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => openPastChat(chat.id)}
                    className="w-full rounded-[12px] px-3 py-3.5 text-left hover:bg-black/[0.04]"
                  >
                    <p className="text-[13px] font-semibold text-[#0A0A0A]">
                      <span className="text-[#6b6b6b]">{chat.quarter}</span>
                      <span className="mx-1.5 text-[#6b6b6b]">·</span>
                      {chat.title}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
