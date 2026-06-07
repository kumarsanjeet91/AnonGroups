"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { CurrentUser, GroupDto, MessageDto } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

export function ChatWindow({
  group,
  initialMessages,
  currentUser,
  onStatusChange,
}: {
  group: GroupDto;
  initialMessages: MessageDto[];
  currentUser: CurrentUser;
  onStatusChange?: (
    status: "connecting" | "connected" | "disconnected"
  ) => void;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messageSetterRef = useRef<
    ((val: string, caretAtEnd?: boolean) => void) | null
  >(null);

  useEffect(() => {
    function onReply(e: Event) {
      const ev = e as CustomEvent;
      const text = ev?.detail?.text || "";
      if (messageSetterRef.current) {
        messageSetterRef.current(text, true);
      }
    }
    window.addEventListener("anongroups:reply", onReply as EventListener);
    return () =>
      window.removeEventListener("anongroups:reply", onReply as EventListener);
  }, []);

  const handleMessage = useCallback((message: MessageDto) => {
    setMessages((current) => {
      if (current.some((existing) => existing._id === message._id))
        return current;
      return [...current, message];
    });
  }, []);

  const { status, sendMessage } = useSocket(group._id, handleMessage);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function onSend(text: string) {
    const result = await sendMessage(text);
    return result.ok ? null : result.error || "Unable to send message.";
  }

  const usernames = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...messages.map((message) => message.username),
            currentUser.username,
          ].filter(Boolean)
        )
      ),
    [currentUser.username, messages]
  );

  return (
    <section className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col bg-slate-50 dark:bg-[#0F172A]">
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4 scrollbar-modern sm:px-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1E293B]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-violet-600 text-2xl font-black text-white">
                #
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-[#F8FAFC]">
                Welcome to {group.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-[#94A3B8]">
                Start the first conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-1 px-3 sm:px-6 lg:px-10">
            {messages.map((message, index) => {
              const previous = messages[index - 1];

              const showDateSeparator =
                !previous ||
                new Date(message.createdAt).toDateString() !==
                  new Date(previous.createdAt).toDateString();

              return (
                <div key={message._id}>
                  {showDateSeparator && (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full border border-white/10 bg-slate-800/70 px-4 py-1 text-xs font-medium text-slate-300">
                        {new Date(message.createdAt).toDateString()}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={message}
                    mine={message.userId === currentUser.userId}
                  />
                </div>
              );
            })}

            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <MessageInput
        disabled={status !== "connected"}
        onSend={onSend}
        candidates={usernames}
        registerTextSetter={(s) => (messageSetterRef.current = s)}
      />
    </section>
  );
}
