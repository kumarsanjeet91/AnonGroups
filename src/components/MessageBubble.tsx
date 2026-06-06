import { MessageDto } from "@/types/chat";
import { getUserColor } from "@/utils/userColor";

export function MessageBubble({
  message,
  mine,
}: {
  message: MessageDto;
  mine: boolean;
}) {
  const username = message.username || "anon";
  const colors = getUserColor(username);
  const date = new Date(message.createdAt);
  // Use UTC-based deterministic formatting to avoid hydration mismatches
  const pad = (n: number) => n.toString().padStart(2, "0");
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const timeLabel = `${pad(hours)}:${pad(minutes)} UTC`;

  return (
    <div
      className={`group flex animate-[fadeIn_160ms_ease-out] gap-3 rounded-md px-2 py-2 transition hover:bg-slate-200/55 dark:hover:bg-white/[0.04] ${
        mine ? "flex-row-reverse sm:pr-12" : "sm:pl-12"
      }`}
    >
      <div
        className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-md text-sm font-black text-white shadow-sm"
        style={{ backgroundColor: colors.bg }}
        aria-hidden="true"
      >
        {username.charAt(0).toUpperCase()}
      </div>

      <div
        className={`min-w-0 flex-1 flex flex-col ${
          mine ? "items-end text-right" : "items-start text-left"
        }`}
      >
        <div
          className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${
            mine ? "justify-end" : ""
          }`}
        >
          <span className="text-sm font-black" style={{ color: colors.text }}>
            @{username}
          </span>
          <time className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
            {timeLabel}
          </time>
          {mine && (
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-bold text-violet-600 dark:text-violet-300">
              You
            </span>
          )}
        </div>

        <div className="mt-1 flex items-start gap-2">
          <p
            className={`max-w-[85%] whitespace-pre-wrap break-words rounded-md px-3 py-2 text-sm leading-relaxed shadow-sm sm:max-w-[900px] ${
              mine
                ? "border-transparent bg-violet-600 text-white dark:bg-violet-500"
                : "border border-slate-200 bg-white text-slate-800 dark:border-white/[0.08] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
            }`}
          >
            {message.text}
          </p>
          <div className="flex translate-y-1 gap-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-500 shadow-sm transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
              aria-label="Reply"
              title="Reply"
            >
              Reply
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-500 shadow-sm transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
              aria-label="Copy"
              title="Copy"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
