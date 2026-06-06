"use client";

import Link from "next/link";
import { GroupDto } from "@/types/chat";

export function GroupList({
  groups,
  activeGroupId,
  compact,
  onNavigate
}: {
  groups: GroupDto[];
  activeGroupId?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  if (groups.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-[#94A3B8]">
        No groups yet.
      </div>
    );
  }

  return (
    <nav className="grid gap-1" aria-label="Public groups">
      {groups.map((group) => {
        const active = group._id === activeGroupId;
        return (
          <Link
            key={group._id}
            href={`/chat/${group._id}`}
            onClick={onNavigate}
            className={`group relative rounded-md border px-3 py-2.5 transition duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
              active
                ? "border-violet-400/40 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.18)] dark:border-violet-400/30 dark:bg-violet-500/15"
                : "border-transparent hover:border-slate-200 hover:bg-slate-100 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.05]"
            }`}
          >
            {active && <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-violet-500" />}
            <div className="flex items-center gap-2">
              <span className={`text-base font-black ${active ? "text-violet-600 dark:text-violet-300" : "text-slate-400 dark:text-slate-500"}`}>#</span>
              <div className="min-w-0">
                <div className={`truncate text-sm font-bold ${active ? "text-slate-950 dark:text-slate-50" : "text-slate-700 dark:text-slate-300"}`}>
                  {group.name}
                </div>
                {!compact && <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#94A3B8]">{group.description}</div>}
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
