"use client";

import { GroupDto } from "@/types/chat";
import { GroupList } from "./GroupList";

export function MobileGroupDrawer({
  open,
  onClose,
  groups,
  activeGroupId,
  username
}: {
  open: boolean;
  onClose: () => void;
  groups: GroupDto[];
  activeGroupId?: string;
  username: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-slate-950/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-label="Close groups drawer"
      />
      <aside
        className={`absolute left-0 top-0 flex h-full w-[min(84vw,320px)] flex-col border-r border-white/10 bg-[#111827] shadow-2xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-4 py-4">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Groups</div>
          <div className="mt-1 text-lg font-black text-slate-50">AnonGroups</div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 scrollbar-modern">
          <GroupList groups={groups} activeGroupId={activeGroupId} compact onNavigate={onClose} />
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-md bg-slate-800/80 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-600 text-sm font-black text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-50">@{username}</div>
              <div className="text-xs text-slate-400">Public profile</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
