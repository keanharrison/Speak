"use client";

import {
  FormEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUp,
  ChevronDown,
  Menu,
  Mic,
  Plus,
  SquarePen,
  X,
} from "lucide-react";
import { useTabBarVisibility } from "@/components/layout/TabBarVisibility";
import { SoftKeyboard } from "@/features/ask/SoftKeyboard";
import { VoiceNotePanel } from "@/features/ask/VoiceNotePanel";
import type { AskMessage, AskPageContent } from "@/types";

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
 * Speak chat — soft keyboard on composer focus; dismiss on outside tap.
 */
export function AskView({ data }: AskViewProps) {
  const router = useRouter();
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
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const { setTabBarVisible } = useTabBarVisibility();
  const lastAboutRef = useRef<string | null>(aboutTopic);
  const lastChatRef = useRef<string | null>(chatId);

  const emptyState = messages.length === 0;
  const showKeyboard = keyboardOpen && !voiceNoteOpen;
  const canSend = draft.trim().length > 0;

  const quarterChats = useMemo(() => {
    const seen = new Set<string>();
    const list: typeof data.pastChats = [];
    for (const chat of data.pastChats) {
      if (seen.has(chat.quarter)) continue;
      seen.add(chat.quarter);
      list.push(chat);
    }
    return list;
  }, [data]);

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
    setTabBarVisible(!showKeyboard && !voiceNoteOpen);
    return () => setTabBarVisible(true);
  }, [showKeyboard, voiceNoteOpen, setTabBarVisible]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showKeyboard]);

  function dismissKeyboard() {
    setKeyboardOpen(false);
    inputRef.current?.blur();
  }

  function focusComposer() {
    setKeyboardOpen(true);
    inputRef.current?.focus({ preventScroll: true });
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
    dismissKeyboard();
  }

  function handleReturn() {
    sendQuestion(draft);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendQuestion(draft);
  }

  function startNewChat() {
    setMessages([]);
    setDraft("");
    setThreadTitle(null);
    setSidebarOpen(false);
    dismissKeyboard();
    router.replace("/ask", { scroll: false });
  }

  function openPastChat(id: string) {
    const chat = data.pastChats.find((item) => item.id === id);
    if (!chat) return;
    setMessages(chat.messages.map((message) => ({ ...message })));
    setThreadTitle(chat.title);
    setSidebarOpen(false);
    dismissKeyboard();
    router.replace(`/ask?chat=${encodeURIComponent(id)}`, { scroll: false });
  }

  function openVoiceNote(event: MouseEvent) {
    event.stopPropagation();
    dismissKeyboard();
    setVoiceNoteOpen(true);
  }

  return (
    <main
      className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-transparent"
      style={{
        paddingTop: "max(0.45rem, calc(var(--speak-page-safe-top) + 0.2rem))",
      }}
      onClick={dismissKeyboard}
    >
      <div className="relative mx-5 mb-3 mt-1 shrink-0">
        <h1 className="page-title text-center text-[24px]">Speak</h1>
        {threadTitle ? (
          <p className="mt-0.5 text-center text-[11px] text-white/65">
            {threadTitle}
          </p>
        ) : null}
        <button
          type="button"
          aria-label="Open screening quarters"
          onClick={(event) => {
            event.stopPropagation();
            setSidebarOpen(true);
          }}
          className="absolute left-0 top-0.5 flex size-7 items-center justify-center text-white"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="New chat"
          onClick={(event) => {
            event.stopPropagation();
            startNewChat();
          }}
          className="absolute right-0 top-0.5 flex size-7 items-center justify-center text-white"
        >
          <SquarePen className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        {emptyState ? (
          <div className="flex min-h-full flex-col items-center justify-center px-5 pb-4 pt-2 text-center">
            <p className="text-[15px] font-medium text-white/90">
              Ask about Bailey&apos;s results
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-5 pb-4 pt-2">
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
                        ? "bg-white/90 text-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        : "glass-panel text-white"
                    }`}
                  >
                    {!isUser ? (
                      <p className="mb-1 text-[12px] font-medium text-white/60">
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
      </div>

      {!voiceNoteOpen ? (
        <div
          className={`relative z-30 shrink-0 ${
            showKeyboard
              ? "bg-[#D1D3D9] px-2.5 pb-1.5 pt-2"
              : "bg-transparent px-5 pb-[6.25rem] pt-1"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div
              className={`relative flex cursor-text items-center gap-2 ${
                showKeyboard
                  ? "glass-light-field min-h-[44px] rounded-full px-2 py-1.5"
                  : "glass-panel min-h-[48px] px-3 py-2"
              }`}
              onClick={focusComposer}
            >
              {showKeyboard ? (
                <>
                  <button
                    type="button"
                    aria-label="Add"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[#3A3A3C]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-0.5 text-[15px] font-semibold text-[#0A0A0A]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Auto
                    <ChevronDown
                      className="h-3.5 w-3.5 text-[#6b6b6b]"
                      strokeWidth={2.25}
                    />
                  </button>
                </>
              ) : null}

              <div className="relative min-w-0 flex-1">
                {!draft ? (
                  <div
                    className={`pointer-events-none absolute inset-y-0 flex items-center ${
                      showKeyboard ? "left-0" : "left-1"
                    }`}
                  >
                    {showKeyboard ? (
                      <span className="typing-caret" aria-hidden />
                    ) : null}
                    <span
                      className={`text-[16px] ${
                        showKeyboard ? "text-[#8E8E93]" : "text-[#6b6b6b]"
                      }`}
                    >
                      {data.inputPlaceholder}
                    </span>
                  </div>
                ) : null}
                <div
                  ref={inputRef}
                  role="textbox"
                  tabIndex={0}
                  aria-label={data.inputPlaceholder}
                  aria-multiline="false"
                  onFocus={() => setKeyboardOpen(true)}
                  className="flex min-h-[28px] min-w-0 items-center text-left text-[16px] text-[#0A0A0A] outline-none"
                >
                  {draft ? (
                    <>
                      <span className="whitespace-pre-wrap break-words">
                        {draft}
                      </span>
                      {showKeyboard ? (
                        <span
                          className="typing-caret ml-0.5 shrink-0"
                          aria-hidden
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                aria-label="Voice note"
                onClick={openVoiceNote}
                className={`flex shrink-0 items-center justify-center rounded-full ${
                  showKeyboard
                    ? "size-8 bg-black/[0.06] text-[#3A3A3C]"
                    : "h-9 w-9 bg-black/[0.06] text-[#3A3A3C]"
                }`}
              >
                <Mic className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="submit"
                aria-label="Send"
                disabled={!canSend}
                className={`flex shrink-0 items-center justify-center rounded-full transition-opacity ${
                  showKeyboard ? "size-8" : "h-9 w-9"
                } ${
                  canSend
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#0A0A0A]/35 text-white"
                }`}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div onClick={(event) => event.stopPropagation()}>
        <SoftKeyboard
          open={showKeyboard}
          onKey={(key) => setDraft((prev) => `${prev}${key}`)}
          onBackspace={() => setDraft((prev) => prev.slice(0, -1))}
          onReturn={handleReturn}
        />
      </div>

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
        <div
          className="absolute inset-0 z-50"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Dismiss sidebar"
            className="absolute inset-0 bg-black/35"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="glass-panel absolute inset-y-0 left-0 flex w-[78%] max-w-[300px] flex-col overflow-hidden !rounded-l-none !rounded-r-[24px] pt-10">
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
              {quarterChats.map((chat) => {
                const active = chatId === chat.id;
                return (
                  <li key={chat.id}>
                    <button
                      type="button"
                      onClick={() => openPastChat(chat.id)}
                      className={`w-full rounded-[12px] px-3 py-3.5 text-left ${
                        active ? "bg-black/[0.06]" : "hover:bg-black/[0.04]"
                      }`}
                    >
                      <p className="text-[15px] font-semibold text-[#0A0A0A]">
                        {chat.quarter}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#6b6b6b]">
                        {chat.preview}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
