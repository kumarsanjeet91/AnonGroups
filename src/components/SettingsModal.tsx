"use client";

import { useEffect, useState } from "react";

export function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [lastChanged, setLastChanged] = useState<{
    username?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (!open) return;
    async function load() {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) {
        setUsername(data.user.username || "");
        setLastChanged({
          username: data.user.usernameChangedAt,
          password: data.user.passwordChangedAt,
        });
      }
    }
    load();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function update(field: "username" | "password") {
    setMessage("");
    const res = await fetch(`/api/auth/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Update failed.");
      return;
    }
    setMessage("Updated.");
    setLastChanged({
      username: data.user.usernameChangedAt,
      password: data.user.passwordChangedAt,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-4 w-full max-w-2xl rounded-md border border-slate-200 bg-white p-6 shadow-lg dark:border-white/[0.08] dark:bg-[#0B1220]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:text-slate-200 dark:hover:bg-white/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-black">Settings</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-[#94A3B8]">
          Update your username or password. Changes show last-changed
          timestamps.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold">
            New username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-[#1E293B]"
            />
            {lastChanged.username && (
              <div className="text-xs font-normal text-slate-500 dark:text-[#94A3B8]">
                Last changed: {new Date(lastChanged.username).toLocaleString()}
              </div>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold">
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-[#1E293B]"
            />
            {lastChanged.password && (
              <div className="text-xs font-normal text-slate-500 dark:text-[#94A3B8]">
                Last changed: {new Date(lastChanged.password).toLocaleString()}
              </div>
            )}
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => update("username")}
              className="rounded-md bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              Update username
            </button>
            <button
              onClick={() => update("password")}
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-[#1E293B] dark:text-slate-100 dark:hover:bg-white/10"
            >
              Update password
            </button>
          </div>

          {message && (
            <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-[#1E293B] dark:text-slate-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
