"use client";

import { useState } from "react";
import { CurrentUser, GroupDto, MessageDto } from "@/types/chat";
import { ChatWindow } from "./ChatWindow";
import { MobileGroupDrawer } from "./MobileGroupDrawer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function ChatExperience({
  group,
  groups,
  initialMessages,
  currentUser
}: {
  group: GroupDto;
  groups: GroupDto[];
  initialMessages: MessageDto[];
  currentUser: CurrentUser;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  return (
    <>
      <Navbar
        username={currentUser.username}
        centerLabel={`# ${group.name}`}
        connectionStatus={status}
        onMenuClick={() => setDrawerOpen(true)}
        showMobileMenu
      />
      <MobileGroupDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={groups}
        activeGroupId={group._id}
        username={currentUser.username}
      />
      <main className="grid h-[calc(100dvh-4rem)] min-h-0 bg-slate-100 text-slate-950 dark:bg-[#0F172A] dark:text-[#F8FAFC] md:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden min-h-0 md:block">
          <Sidebar groups={groups} activeGroupId={group._id} username={currentUser.username} />
        </div>
        <ChatWindow
          group={group}
          initialMessages={initialMessages}
          currentUser={currentUser}
          onStatusChange={setStatus}
        />
      </main>
    </>
  );
}
