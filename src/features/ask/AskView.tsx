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
import { ArrowUp, Menu, Mic, SquarePen, X } from "lucide-react";
import { useTabBarVisibility } from "@/components/layout/TabBarVisibility";
import { SpeakWordmark } from "@/components/ui/SpeakWordmark";
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
 * Speak chat — native iOS keyboard; nav hides while focused; layout does not squash.
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
  const [keyboardLift, setKeyboardLift] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const { setTabBarVisible } = useTabBarVisibility();
  const lastAboutRef = useRef<string | null>(aboutTopic);
  const lastChatRef = useRef<string | null>(chatId);

  const emptyState = messages.length === 0;
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
    const showNav = !keyboardOpen && !voiceNoteOpen;
    setTabBarVisible(showNav);
    return () => setTabBarVisible(true);
  }, [keyboardOpen, voiceNoteOpen, setTabBarVisible]);

  // Lift composer above the native keyboard without resizing the page shell
  useEffect(() => {
    if (!keyboardOpen) {
      setKeyboardLift(0);
      return;
    }

    const syncLift = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setKeyboardLift(0);
        return;
      }
      const covered = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - vv.offsetTop),
      );
      setKeyboardLift(covered);
    };

    syncLift();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", syncLift);
    vv?.addEventListener("scroll", syncLift);
    window.addEventListener("resize", syncLift);
    return () => {
      vv?.removeEventListener("resize", syncLift);
      vv?.removeEventListener("scroll", syncLift);
      window.removeEventListener("resize", syncLift);
    };
  }, [keyboardOpen]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, keyboardOpen]);

  function dismissKeyboard() {
    setKeyboardOpen(false);
    inputRef.current?.blur();
  }

  function focusComposer() {
    inputRef.current?.focus();
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
        paddingTop:
          "max(3.1rem, calc(var(--speak-page-safe-top) + 2.35rem))",
      }}
      onClick={dismissKeyboard}
    >
      <div className="relative mx-5 mb-3 mt-1 shrink-0">
        <h1 className="text-center">
          <SpeakWordmark
            tone="light"
            className="text-[28px] sm:text-[30px]"
          />
        </h1>
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
          className="absolute left-0 top-1 flex size-8 items-center justify-center text-white"
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
          className="absolute right-0 top-1 flex size-8 items-center justify-center text-white"
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
          className={`relative z-30 shrink-0 px-5 pt-1 transition-[padding] duration-150 ${
            keyboardOpen ? "pb-2" : "pb-[5.25rem]"
          }`}
          style={{
            transform:
              keyboardLift > 0 ? `translateY(-${keyboardLift}px)` : undefined,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div
              className="glass-panel relative z-[1] flex min-h-[48px] cursor-text items-center gap-2 rounded-full px-3 py-2"
              onClick={focusComposer}
            >
              <input
                ref={inputRef}
                type="text"
                enterKeyHint="send"
                autoComplete="off"
                autoCorrect="on"
                spellCheck
                value={draft}
                placeholder={data.inputPlaceholder}
                aria-label={data.inputPlaceholder}
                onChange={(event) => setDraft(event.target.value)}
                onFocus={() => setKeyboardOpen(true)}
                onBlur={() => setKeyboardOpen(false)}
                className="relative z-[1] min-h-[28px] min-w-0 flex-1 bg-transparent text-left text-[16px] text-white outline-none placeholder:text-white/70"
              />

              <button
                type="button"
                aria-label="Voice note"
                onClick={openVoiceNote}
                className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0A0A0A]"
              >
                <Mic className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="submit"
                aria-label="Send"
                disabled={!canSend}
                className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0A0A0A] transition-opacity ${
                  canSend ? "opacity-100" : "opacity-45"
                }`}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
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
              <p className="text-[15px] font-semibold text-white">
                {data.pastChatsHeading}
              </p>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-white"
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
                        active ? "bg-white/12" : "hover:bg-white/8"
                      }`}
                    >
                      <p className="text-[15px] font-semibold text-white">
                        {chat.quarter}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/65">
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
