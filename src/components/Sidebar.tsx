import Link from "next/link";
import { useState } from "react";
import { GroupDto } from "@/types/chat";
import { GroupList } from "./GroupList";
import { SettingsModal } from "./SettingsModal";

export function Sidebar({
  groups,
  activeGroupId,
  username,
}: {
  groups: GroupDto[];
  activeGroupId?: string;
  username?: string;
}) {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#111827]">
      <div className="border-b border-slate-200 px-4 py-4 dark:border-white/[0.08]">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-[#94A3B8]">
          Groups
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Public channels only
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 scrollbar-modern">
        <GroupList groups={groups} activeGroupId={activeGroupId} compact />
      </div>
      {username && (
        <div className="border-t border-slate-200 p-3 dark:border-white/[0.08]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.08] dark:bg-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-600 text-sm font-black text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-slate-950 dark:text-[#F8FAFC]">
                  @{username}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  Online
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setOpenSettings(true)}
                className="rounded-md border border-slate-200 bg-white px-2 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Settings
              </button>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-slate-200 bg-white px-2 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </aside>
  );
}
