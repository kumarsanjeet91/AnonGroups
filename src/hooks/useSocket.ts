"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MessageDto } from "@/types/chat";

export function useSocket(groupId: string, onMessage: (message: MessageDto) => void) {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  useEffect(() => {
    const socket = io({ path: "/socket.io", withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-group", groupId);
    });
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("disconnected"));
    socket.on("new-message", onMessage);

    return () => {
      socket.emit("leave-group", groupId);
      socket.off("new-message", onMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId, onMessage]);

  function sendMessage(text: string) {
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      socketRef.current?.emit("send-message", { groupId, text }, (response: { ok: boolean; error?: string }) => {
        resolve(response);
      });
    });
  }

  return { status, sendMessage };
}
