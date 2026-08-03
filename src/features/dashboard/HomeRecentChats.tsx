import Link from "next/link";

export type HomeRecentChatItem = {
  id: string;
  title: string;
  preview: string;
  href: string;
};

type HomeRecentChatsProps = {
  heading: string;
  ctaLabel: string;
  chats: HomeRecentChatItem[];
};

/** Resume in Speak — one card per screening quarter. */
export function HomeRecentChats({
  heading,
  ctaLabel,
  chats,
}: HomeRecentChatsProps) {
  if (chats.length === 0) return null;

  return (
    <section aria-label={heading} className="relative z-10 mt-6">
      <h2 className="section-title">{heading}</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              href={chat.href}
              className="glass-panel flex w-full min-h-[52px] min-w-0 items-center gap-3 overflow-hidden px-4 py-3.5 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#0A0A0A]">
                  {chat.title}
                </p>
                {chat.preview ? (
                  <p className="mt-0.5 truncate text-[12px] text-[#6b6b6b]">
                    {chat.preview}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-[13px] font-semibold text-[#0A0A0A]">
                {ctaLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
